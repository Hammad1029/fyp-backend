// index.ts
import express from "express";

// routes/index.js
import { Router as Router10 } from "express";

// routes/admin/index.ts
import { Router as Router7 } from "express";

// utils/constants.ts
var passport = {
  admin: "admin-jwt",
  player: "player-jwt"
};
var env = {
  jwtSecret: process.env.JWT_SECRET || "oooo",
  sessionSecret: process.env.SESSION_SECRET || "oooo",
  port: process.env.PORT || 3001
};
var defaultPassword = process.env.DEFAULT_PASSWORD || "hello123";
var bcryptRounds = 10;

// utils/prisma.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var prisma_default = prisma;

// utils/utils.ts
var responseHandler = (res, status, message, data, error) => {
  if (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  } else {
    res.status(200).json({ status, message, data });
  }
};
var createRandomString = (length) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

// controllers/admin/auth.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var signIn = async (req, res) => {
  try {
    const user = await prisma_default.admins.findFirst({
      where: { email: req.body.email },
      include: {
        role: {
          include: { RolePermissions: { include: { permission: true } } }
        }
      }
    });
    if (!user) return responseHandler(res, false, "user not found");
    const authenticated = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!authenticated) return responseHandler(res, false, "invalid password");
    const token = jwt.sign({ email: user.email }, env.jwtSecret, {
      subject: String(user.id)
    });
    await prisma_default.admins.update({
      where: {
        id: user.id
      },
      data: {
        token
      }
    });
    responseHandler(res, true, "Successful", { token, user });
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var signOut = async (req, res) => {
  try {
    await prisma_default.admins.update({
      where: {
        id: req.user?.data?.id
      },
      data: {
        token: ""
      }
    });
    let err = null;
    req.logout((e) => err = e);
    if (err) throw err;
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};

// routes/admin/auth.ts
import { Router } from "express";
import passport2 from "passport";
var authRouter = Router();
authRouter.post("/sign-in", signIn);
authRouter.get(
  "/sign-out",
  passport2.authenticate(passport.admin),
  signOut
);
var auth_default = authRouter;

// controllers/admin/roles.ts
var getRoles = async (req, res) => {
  try {
    const roles = await prisma_default.roles.findMany({
      include: { Admins: true, RolePermissions: true }
    });
    responseHandler(res, true, "Successful", roles);
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var createRole = async (req, res) => {
  try {
    const foundPermissions = await prisma_default.permissions.findMany({
      where: {
        id: {
          in: req.body.permissions
        }
      }
    });
    if (!foundPermissions || foundPermissions.length !== req.body.permissions.length)
      return responseHandler(res, false, "permissions not found");
    const createLinks = req.body.permissions.map((p) => ({
      permissionId: p
    }));
    await prisma_default.roles.create({
      data: {
        name: req.body.name,
        RolePermissions: {
          create: createLinks
        }
      }
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var updateRole = async (req, res) => {
  try {
    const role = await prisma_default.roles.findFirst({
      where: {
        id: req.body.role_id
      }
    });
    if (!role) return responseHandler(res, false, "role not found");
    if (req.body.name !== role.name) {
      const roleNameExists = await prisma_default.roles.findMany({
        where: { name: req.body.name }
      });
      if (roleNameExists.length > 0)
        return responseHandler(
          res,
          false,
          `role with name ${req.body.name} already exists`
        );
      await prisma_default.roles.update({
        data: {
          name: req.body.name
        },
        where: { id: role.id }
      });
    }
    await prisma_default.rolePermissions.deleteMany({ where: { roleId: role.id } });
    await prisma_default.rolePermissions.createMany({
      data: req.body.permissions.map((p) => ({
        roleId: role.id,
        permissionId: p
      }))
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var deleteRole = async (req, res) => {
  try {
    const role = await prisma_default.roles.findFirst({
      where: {
        id: req.body.role_id
      }
    });
    if (!role) return responseHandler(res, false, "role not found ");
    await prisma_default.rolePermissions.deleteMany({ where: { roleId: role.id } });
    await prisma_default.roles.delete({ where: { id: role.id } });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var getPermissions = async (req, res) => {
  try {
    const permissions = await prisma_default.permissions.findMany();
    responseHandler(res, true, "Successful", permissions);
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};

// routes/admin/roles.ts
import { Router as Router2 } from "express";
import passport3 from "passport";
var roleRouter = Router2();
roleRouter.get(
  "/",
  passport3.authenticate(passport.admin),
  getRoles
);
roleRouter.put(
  "/",
  passport3.authenticate(passport.admin),
  updateRole
);
roleRouter.post(
  "/",
  passport3.authenticate(passport.admin),
  createRole
);
roleRouter.delete(
  "/",
  passport3.authenticate(passport.admin),
  deleteRole
);
roleRouter.get(
  "/permissions",
  passport3.authenticate(passport.admin),
  getPermissions
);
var roles_default = roleRouter;

// controllers/admin/users.ts
import bcrypt2 from "bcrypt";

// utils/email.ts
import nodemailer from "nodemailer";
var senderEmail = process.env.NODEMAILER_EMAIL;
var senderPassword = process.env.NODEMAILER_PASSWORD;
var transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: senderEmail,
    pass: senderPassword
  }
});
var sendEmail = async (params) => {
  try {
    if (params.to.length === 0) return null;
    const verified = await transporter.verify();
    if (verified) {
      const email = await transporter.sendMail({
        from: senderEmail,
        to: params.to.join(","),
        subject: params.subject,
        html: params.body
      });
      return null;
    } else throw Error("SMTP connection could not be verified");
  } catch (e) {
    return String(e);
  }
};
var email_default = sendEmail;

// controllers/admin/users.ts
var getUsers = async (req, res) => {
  try {
    const users = await prisma_default.admins.findMany({
      include: { institution: true, role: true }
    });
    responseHandler(res, true, "Successful", users);
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var createUser = async (req, res) => {
  try {
    const foundRole = await prisma_default.roles.findFirst({
      where: {
        id: req.body.roleId
      }
    });
    if (!foundRole) return responseHandler(res, false, "role not found");
    const foundInstitution = await prisma_default.institution.findFirst({
      where: {
        id: req.body.institutionId
      }
    });
    if (!foundInstitution)
      return responseHandler(res, false, "institution not found");
    const newPassword = createRandomString(8);
    const password = await bcrypt2.hash(newPassword, bcryptRounds);
    await prisma_default.admins.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password,
        institutionId: foundInstitution.id,
        roleId: foundRole.id,
        token: ""
      }
    });
    const mailError = await email_default({
      to: [req.body.email],
      subject: `Welcome to mindtrack ${req.body.name}`,
      body: `<ul style="line-height: 1.6;">
              <li><strong>Name:</strong> ${req.body.name}</li>
              <li><strong>Email:</strong> ${req.body.email}</li>
              <li><strong>Password:</stronz> ${newPassword}</li>
              <li><strong>Institution:</strong> ${foundInstitution.name}</li>
              <li><strong>Role:</strong> ${foundRole.name}</li>
            </ul>`
    });
    if (mailError) throw new Error(mailError);
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var updateUser = async (req, res) => {
  try {
    const user = await prisma_default.admins.findFirst({
      where: {
        id: req.body.id
      }
    });
    if (!user) return responseHandler(res, false, "user not found");
    const foundRole = await prisma_default.permissions.findFirst({
      where: {
        id: req.body.role_id
      }
    });
    if (!foundRole) return responseHandler(res, false, "role not found");
    const foundInstitution = await prisma_default.institution.findFirst({
      where: {
        id: req.body.institutionId
      }
    });
    if (!foundInstitution)
      return responseHandler(res, false, "institution not found");
    await prisma_default.admins.update({
      data: {
        name: req.body.name,
        email: req.body.email,
        institutionId: foundInstitution.id,
        roleId: foundRole.id
      },
      where: {
        id: user.id
      }
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var deleteUser = async (req, res) => {
  try {
    const user = await prisma_default.admins.findFirst({
      where: {
        id: req.body.user_id
      }
    });
    if (!user || !req.body.user_id)
      return responseHandler(res, false, "user not found");
    await prisma_default.admins.delete({ where: { id: req.body.user_id } });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};

// routes/admin/user.ts
import { Router as Router3 } from "express";
import passport4 from "passport";
var userRouter = Router3();
userRouter.get(
  "/",
  passport4.authenticate(passport.admin),
  getUsers
);
userRouter.put(
  "/",
  passport4.authenticate(passport.admin),
  updateUser
);
userRouter.post(
  "/",
  passport4.authenticate(passport.admin),
  createUser
);
userRouter.delete(
  "/",
  passport4.authenticate(passport.admin),
  deleteUser
);
var user_default = userRouter;

// controllers/admin/institution.ts
var getInstitution = async (req, res) => {
  try {
    const institutions = await prisma_default.institution.findMany({
      include: {
        Admins: true,
        Game: true,
        PlayerInstitution: true,
        type: true
      }
    });
    responseHandler(res, true, "Successful", institutions);
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var createInstitution = async (req, res) => {
  try {
    const institutionType = await prisma_default.institutionTypes.findFirst({
      where: { id: req.body.type }
    });
    if (!institutionType)
      return responseHandler(res, false, "institution type not found");
    await prisma_default.institution.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        logo: req.body.logo,
        typeId: req.body.typeId
      }
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var updateInstitution = async (req, res) => {
  try {
    const institution = await prisma_default.institution.findFirst({
      where: {
        id: req.body.institution_id
      }
    });
    if (!institution)
      return responseHandler(res, false, "institution not found");
    const institutionType = await prisma_default.institutionTypes.findFirst({
      where: { id: req.body.typeId }
    });
    if (!institutionType)
      return responseHandler(res, false, "institution type not found");
    await prisma_default.institution.update({
      data: {
        name: req.body.name,
        email: req.body.email,
        logo: req.body.logo,
        typeId: req.body.typeId
      },
      where: { id: institution.id }
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var deleteInstitution = async (req, res) => {
  try {
    const institution = await prisma_default.institution.findFirst({
      where: {
        id: req.body.institution_id
      }
    });
    if (!institution)
      return responseHandler(res, false, "institution not found");
    await prisma_default.admins.deleteMany({
      where: { institutionId: institution.id }
    });
    await prisma_default.institution.delete({ where: { id: institution.id } });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var getInstitutionTypes = async (req, res) => {
  try {
    const institution = await prisma_default.institutionTypes.findMany();
    responseHandler(res, true, "Successful", institution);
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};

// routes/admin/institution.ts
import { Router as Router4 } from "express";
import passport5 from "passport";
var institutionRouter = Router4();
institutionRouter.get(
  "/",
  passport5.authenticate(passport.admin),
  getInstitution
);
institutionRouter.put(
  "/",
  passport5.authenticate(passport.admin),
  updateInstitution
);
institutionRouter.post(
  "/",
  passport5.authenticate(passport.admin),
  createInstitution
);
institutionRouter.delete(
  "/",
  passport5.authenticate(passport.admin),
  deleteInstitution
);
institutionRouter.get(
  "/types",
  passport5.authenticate(passport.admin),
  getInstitutionTypes
);
var institution_default = institutionRouter;

// controllers/admin/questions.ts
var getQuestions = async (req, res) => {
  try {
    const questions = await prisma_default.question.findMany({
      include: { Answer: true, GameQuestion: true }
    });
    responseHandler(res, true, "Successful", questions);
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};

// routes/admin/questions.ts
import { Router as Router5 } from "express";
import passport6 from "passport";
var questionRouter = Router5();
questionRouter.get(
  "/",
  passport6.authenticate(passport.admin),
  getQuestions
);
var questions_default = questionRouter;

// controllers/admin/game.ts
var getGames = async (req, res) => {
  try {
    const games = await prisma_default.game.findMany({
      include: { GameQuestion: true, institution: true, Attempt: true }
    });
    responseHandler(res, true, "Successful", games);
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var createGame = async (req, res) => {
  try {
    await prisma_default.game.create({
      data: {
        name: req.body.name,
        institutionId: req.body.institutionId,
        tags: req.body.tags,
        time: req.body.time,
        giveQuestions: req.body.giveQuestions,
        GameQuestion: {
          create: req.body.questions.map((q) => ({
            questionId: q
          }))
        }
      }
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var updateGame = async (req, res) => {
  try {
    const game = await prisma_default.game.findFirst({
      where: {
        id: req.body.game_id
      }
    });
    if (!game) return responseHandler(res, false, "game not found");
    await prisma_default.gameQuestion.deleteMany({
      where: { gameId: game.id }
    });
    await prisma_default.game.create({
      data: {
        name: req.body.name || game.name,
        institutionId: req.body.institutionId || game.institutionId,
        tags: req.body.tags || game.tags,
        time: req.body.time || game.time,
        giveQuestions: req.body.giveQuestions || game.giveQuestions,
        GameQuestion: {
          create: req.body.questions.map((q) => ({
            questionId: q
          }))
        }
      }
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var deleteGame = async (req, res) => {
  try {
    const game = await prisma_default.question.findFirst({
      where: {
        id: req.body.game_id
      }
    });
    if (!game) return responseHandler(res, false, "game not found");
    await prisma_default.game.deleteMany({
      where: { id: game.id }
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};

// routes/admin/game.ts
import { Router as Router6 } from "express";
import passport7 from "passport";
var gameRouter = Router6();
gameRouter.get(
  "/",
  passport7.authenticate(passport.admin),
  getGames
);
gameRouter.put(
  "/",
  passport7.authenticate(passport.admin),
  updateGame
);
gameRouter.post(
  "/",
  passport7.authenticate(passport.admin),
  createGame
);
gameRouter.delete(
  "/",
  passport7.authenticate(passport.admin),
  deleteGame
);
var game_default = gameRouter;

// routes/admin/index.ts
var adminRouter = Router7();
adminRouter.use("/auth/", auth_default);
adminRouter.use("/roles/", roles_default);
adminRouter.use("/users/", user_default);
adminRouter.use("/institutions/", institution_default);
adminRouter.use("/questions/", questions_default);
adminRouter.use("/games/", game_default);
var admin_default = adminRouter;

// routes/player/index.ts
import { Router as Router9 } from "express";

// controllers/player/auth.ts
import bcrypt3 from "bcrypt";
import jwt2 from "jsonwebtoken";
var signUp = async (req, res) => {
  try {
    const user = await prisma_default.player.findFirst({
      where: { email: req.body.email }
    });
    if (user) return responseHandler(res, false, "player already exists");
    const password = await bcrypt3.hash(
      req.body.password,
      bcryptRounds
    );
    await prisma_default.player.create({
      data: {
        email: req.body.email,
        displayName: req.body.displayName,
        profilePhoto: req.body.profilePhoto,
        education: req.body.education,
        PlayerInstitution: {
          create: req.body.institutions.map((i) => ({
            institutionId: i
          }))
        },
        password,
        token: ""
      }
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var signIn2 = async (req, res) => {
  try {
    const user = await prisma_default.player.findFirst({
      where: { email: req.body.email }
    });
    if (!user) return responseHandler(res, false, "player not found");
    const authenticated = await bcrypt3.compare(
      req.body.password,
      user.password
    );
    if (!authenticated) return responseHandler(res, false, "invalid password");
    const token = jwt2.sign({ email: user.email }, env.jwtSecret, {
      subject: String(user.id)
    });
    await prisma_default.player.update({
      where: {
        id: user.id
      },
      data: {
        token
      }
    });
    responseHandler(res, true, "Successful", { token });
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var signOut2 = async (req, res) => {
  try {
    await prisma_default.player.update({
      where: {
        id: req.user?.data?.id
      },
      data: {
        token: ""
      }
    });
    let err = null;
    req.logout((e) => err = e);
    if (err) throw err;
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var forgetPassword = async (req, res) => {
  try {
    const user = await prisma_default.player.findFirst({
      where: { email: req.body.email }
    });
    if (!user) responseHandler(res, false, "user not found");
    else {
      const newPassword = createRandomString(8);
      const hashed = await bcrypt3.hash(newPassword, bcryptRounds);
      await prisma_default.player.update({
        data: { password: hashed },
        where: { id: user.id }
      });
      const emailError = await email_default({
        to: [user.email],
        subject: `Reset Password for ${user.email}`,
        body: `<ul style="line-height: 1.6;">
                <li><strong>Name:</strong> ${user.displayName}</li>
                <li><strong>Email:</strong> ${user.email}</li>
                <li><strong>New Password:</strong> ${newPassword}</li>
              </ul>`
      });
      if (emailError) throw new Error(emailError);
    }
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};

// routes/player/auth.ts
import { Router as Router8 } from "express";
import passport8 from "passport";
var authRouter2 = Router8();
authRouter2.post("/sign-up", signUp);
authRouter2.post("/sign-in", signIn2);
authRouter2.get(
  "/sign-out",
  passport8.authenticate(passport.player),
  signOut2
);
authRouter2.post("/forgot-password", forgetPassword);
var auth_default2 = authRouter2;

// routes/player/index.ts
var playerRouter = Router9();
playerRouter.use("/auth", auth_default2);
var player_default = playerRouter;

// routes/index.js
var appRouter = Router10();
appRouter.use("/admin", admin_default);
appRouter.use("/player", player_default);
var routes_default = appRouter;

// index.ts
import passport10 from "passport";

// utils/passport.js
import { ExtractJwt, Strategy } from "passport-jwt";
import passport9 from "passport";
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwtSecret
};
passport9.use(passport.admin, new Strategy(opts, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
  try {
    const user = yield prisma_default.admins.findFirst({
      where: { id: parseInt(payload.sub) }
    });
    if (user)
      return done(null, { type: passport.admin, data: user });
    return done(null, false);
  } catch (error) {
    return done(error);
  }
})));
passport9.use(passport.player, new Strategy(opts, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
  try {
    const user = yield prisma_default.player.findFirst({
      where: { id: payload.sub }
    });
    if (user)
      return done(null, { type: passport.player, data: user });
    return done(null, false);
  } catch (error) {
    return done(error);
  }
})));
passport9.serializeUser((user, done) => {
  done(null, { type: user.type, id: user.data.id });
});

// index.ts
import session from "express-session";

// utils/constants.js
var env2 = {
  jwtSecret: process.env.JWT_SECRET || "oooo",
  sessionSecret: process.env.SESSION_SECRET || "oooo",
  port: process.env.PORT || 3001
};
var defaultPassword3 = process.env.DEFAULT_PASSWORD || "hello123";

// index.ts
import cors from "cors";
var app = express();
app.set("trust proxy", 1);
app.use(
  session({
    secret: env2.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1e3
    }
  })
);
var port = env2.port;
app.use(cors());
app.use(express.json());
app.use(passport10.initialize());
app.use(passport10.session());
app.use((req, res, next) => {
  if (!req.session) res.status(401);
  else next();
});
app.use(routes_default);
app.listen(port, (e) => {
  if (e) console.error(e);
  else console.log(`Server running on port: ${port}`);
});
//# sourceMappingURL=index.js.map