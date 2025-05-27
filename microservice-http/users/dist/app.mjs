// src/utils/constants.ts
var env = {
  jwtSecret: process.env.JWT_SECRET || "oooo",
  port: process.env.PORT || 3002
};
var defaultPassword = process.env.DEFAULT_PASSWORD || "hello123";
var bcryptRounds = 10;
var services = {
  institutions: process.env.INSTITUTION_SERVICE,
  users: process.env.USER_SERVICE,
  games: process.env.GAME_SERVICE,
  attempts: process.env.ATTEMPT_SERVICE
};
var nodemailer = {
  email: process.env.NODEMAILER_EMAIL,
  password: process.env.NODEMAILER_PASSWORD
};

// src/services/institution.ts
import axios from "axios";
var serviceURL = services.institutions;
var InstitutionService = class {
  constructor() {
    this.getInstitutionsByIDs = async (ids) => {
      try {
        const institutions = await axios.post(`${serviceURL}/internal/getByID`, {
          institutionIds: ids
        });
        return institutions.data.data;
      } catch (e) {
        console.error(e);
        return false;
      }
    };
    this.getInstitutionByType = async (type) => {
      try {
        const institutions = await axios.post(
          `${serviceURL}/internal/getByType`,
          { institutionType: type }
        );
        return institutions.data.data;
      } catch (e) {
        console.error(e);
        return false;
      }
    };
    this.updatePlayerInstitutions = async (playerId, institutionIds) => {
      try {
        const institutions = await axios.post(
          `${serviceURL}/internal/updatePlayerInstitutions`,
          { playerId, institutionIds }
        );
        if (!institutions.data?.status)
          throw new Error("could not update institutions");
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    };
    this.getPlayerInstitutions = async (playerId) => {
      try {
        const institutions = await axios.post(
          `${serviceURL}/internal/getPlayerInstitutions`,
          { playerId }
        );
        if (!institutions.data?.status)
          throw new Error("could not update institutions");
        return institutions.data.data;
      } catch (e) {
        console.error(e);
        return false;
      }
    };
  }
};
var insitutionService = new InstitutionService();
var institution_default = insitutionService;

// src/utils/email.ts
import nodemailer2 from "nodemailer";
var transporter = nodemailer2.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: nodemailer.email,
    pass: nodemailer.password
  }
});
var sendEmail = async (params) => {
  try {
    if (params.to.length === 0) return null;
    const verified = await transporter.verify();
    if (verified) {
      const email = await transporter.sendMail({
        from: nodemailer.email,
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

// src/utils/utils.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
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

// src/controllers/admin.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
var signIn = async (req, res) => {
  try {
    const user = await prisma.admins.findFirst({
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
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        institution: user.institutionId,
        permissions: user.role.RolePermissions.map((rp) => rp.permission.name)
      },
      env.jwtSecret,
      {
        subject: String(user.id)
      }
    );
    await prisma.admins.update({
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
    await prisma.admins.update({
      where: {
        id: res.locals.user.id
      },
      data: {
        token: ""
      }
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var getUsers = async (req, res) => {
  try {
    const users = await prisma.admins.findMany({
      include: { role: true },
      where: {
        OR: [
          { name: { contains: String(req.query.search || "") } },
          { email: { contains: String(req.query.search || "") } }
        ]
      }
    });
    responseHandler(res, true, "Successful", users);
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var createUser = async (req, res) => {
  try {
    const exists = await prisma.admins.findFirst({
      where: {
        email: req.body.email
      }
    });
    if (exists)
      return responseHandler(res, false, "user with email already exists");
    const foundRole = await prisma.roles.findFirst({
      where: {
        id: req.body.roleId
      }
    });
    if (!foundRole) return responseHandler(res, false, "role not found");
    const foundInstitution = await institution_default.getInstitutionsByIDs([
      req.body.institutionId
    ]);
    if (!foundInstitution || !Array.isArray(foundInstitution))
      throw new Error("could not get institutions");
    else if (foundInstitution.length === 0)
      return responseHandler(res, false, "institution not found");
    const newPassword = createRandomString(8);
    const password = await bcrypt.hash(newPassword, bcryptRounds);
    await prisma.admins.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password,
        institutionId: req.body.institutionId,
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
    const user = await prisma.admins.findFirst({
      where: {
        id: req.body.id
      }
    });
    if (!user) return responseHandler(res, false, "user not found");
    const foundRole = await prisma.roles.findFirst({
      where: {
        id: req.body.roleId
      }
    });
    if (!foundRole) return responseHandler(res, false, "role not found");
    const foundInstitution = await institution_default.getInstitutionsByIDs([
      req.body.institutionId
    ]);
    if (!foundInstitution || !Array.isArray(foundInstitution))
      throw new Error("could not get institutions");
    else if (foundInstitution.length === 0)
      return responseHandler(res, false, "institution not found");
    await prisma.admins.update({
      data: {
        name: req.body.name,
        email: req.body.email,
        institutionId: req.body.institutionId,
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
    const user = await prisma.admins.findFirst({
      where: {
        id: req.body.userId
      }
    });
    if (!user || !req.body.userId)
      return responseHandler(res, false, "user not found");
    await prisma.admins.delete({ where: { id: req.body.userId } });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var getRoles = async (req, res) => {
  try {
    const roles = await prisma.roles.findMany({
      include: { Admins: true, RolePermissions: true },
      where: {
        name: { contains: String(req.query.search || "") }
      }
    });
    responseHandler(res, true, "Successful", roles);
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var createRole = async (req, res) => {
  try {
    const foundPermissions = await prisma.permissions.findMany({
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
    await prisma.roles.create({
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
    const role = await prisma.roles.findFirst({
      where: {
        id: req.body.roleId
      }
    });
    if (!role) return responseHandler(res, false, "role not found");
    if (req.body.name !== role.name) {
      const roleNameExists = await prisma.roles.findMany({
        where: { name: req.body.name }
      });
      if (roleNameExists.length > 0)
        return responseHandler(
          res,
          false,
          `role with name ${req.body.name} already exists`
        );
      await prisma.roles.update({
        data: {
          name: req.body.name
        },
        where: { id: role.id }
      });
    }
    await prisma.rolePermissions.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermissions.createMany({
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
    const role = await prisma.roles.findFirst({
      where: {
        id: req.body.roleId
      }
    });
    if (!role) return responseHandler(res, false, "role not found ");
    const roleAssignees = await prisma.admins.findMany({
      where: {
        roleId: req.body.roleId
      }
    });
    if (roleAssignees.length > 0)
      return responseHandler(
        res,
        false,
        `Role assigned to ${roleAssignees.length} users`
      );
    await prisma.rolePermissions.deleteMany({ where: { roleId: role.id } });
    await prisma.roles.delete({ where: { id: role.id } });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var getPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permissions.findMany();
    responseHandler(res, true, "Successful", permissions);
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};

// src/routes/admin.ts
import { Router } from "express";

// src/utils/middlewares.ts
import jwt2 from "jsonwebtoken";
var authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || null;
    if (!token) return responseHandler(res, false, "token not found");
    try {
      res.locals.user = jwt2.verify(token, env.jwtSecret);
      next();
    } catch (e) {
      console.log(e);
      return responseHandler(res, false, "invalid token");
    }
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var authorize = (perm) => async (req, res, next) => {
  try {
    const permissions = res.locals.user.permissions;
    if (Array.isArray(permissions) && permissions.includes(perm)) next();
    else return responseHandler(res, false, `permission ${perm} required`);
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};

// src/routes/admin.ts
var router = Router();
router.post("/sign-in", signIn);
router.get("/sign-out", authenticate, signOut);
router.get(
  "/users",
  authenticate,
  authorize("user-view"),
  getUsers
);
router.put(
  "/users",
  authenticate,
  authorize("user-edit"),
  updateUser
);
router.post(
  "/users",
  authenticate,
  authorize("user-add"),
  createUser
);
router.delete(
  "/users",
  authenticate,
  authorize("user-delete"),
  deleteUser
);
router.get(
  "/roles",
  authenticate,
  authorize("role-view"),
  getRoles
);
router.put(
  "/roles",
  authenticate,
  authorize("role-edit"),
  updateRole
);
router.post(
  "/roles",
  authenticate,
  authorize("role-add"),
  createRole
);
router.delete(
  "/roles",
  authenticate,
  authorize("role-delete"),
  deleteRole
);
router.get(
  "/permissions",
  authenticate,
  authorize("role-view"),
  getPermissions
);
var admin_default = router;

// src/controllers/player.ts
import bcrypt2 from "bcryptjs";
import jwt3 from "jsonwebtoken";
var signUp = async (req, res) => {
  try {
    const user = await prisma.player.findFirst({
      where: { email: req.body.email }
    });
    if (user) return responseHandler(res, false, "player already exists");
    const password = await bcrypt2.hash(
      req.body.password,
      bcryptRounds
    );
    const mindtrackInstitution = await institution_default.getInstitutionByType(
      "Mindtrack"
    );
    if (!mindtrackInstitution)
      return responseHandler(res, false, "mindtrack institution not found");
    const otherInstitutions = await institution_default.getInstitutionsByIDs(
      req.body.institutions
    );
    if (!otherInstitutions || !Array.isArray(otherInstitutions))
      throw new Error("could not get institutions");
    else if (otherInstitutions.length < req.body.institutions.length)
      return responseHandler(res, false, "missing institutions");
    const player = await prisma.player.create({
      data: {
        email: req.body.email,
        displayName: req.body.displayName,
        profilePhoto: req.body.profilePhoto,
        education: req.body.education,
        password,
        token: ""
      }
    });
    const addInstitutions = await institution_default.updatePlayerInstitutions(
      player.id,
      req.body.institutions
    );
    if (!addInstitutions) {
      await prisma.player.delete({ where: { id: player.id } });
      return responseHandler(
        res,
        false,
        "could not add institutions, sign up again"
      );
    }
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var signIn2 = async (req, res) => {
  try {
    const user = await prisma.player.findFirst({
      where: { email: req.body.email }
    });
    if (!user) return responseHandler(res, false, "player not found");
    const authenticated = await bcrypt2.compare(
      req.body.password,
      user.password
    );
    if (!authenticated) return responseHandler(res, false, "invalid password");
    const playerInstitutions = await institution_default.getPlayerInstitutions(
      user.id
    );
    if (!playerInstitutions)
      return responseHandler(res, false, "could not get player institutions");
    const token = jwt3.sign(
      {
        email: user.email,
        displayName: user.displayName,
        institutionIds: playerInstitutions.map((p) => p.id),
        education: user.education
      },
      env.jwtSecret,
      {
        subject: String(user.id)
      }
    );
    await prisma.player.update({
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
    await prisma.player.update({
      where: {
        id: res.locals.user.id
      },
      data: {
        token: ""
      }
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};
var forgetPassword = async (req, res) => {
  try {
    const user = await prisma.player.findFirst({
      where: { email: req.body.email }
    });
    if (!user) responseHandler(res, false, "user not found");
    else {
      const newPassword = createRandomString(8);
      const hashed = await bcrypt2.hash(newPassword, bcryptRounds);
      await prisma.player.update({
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

// src/routes/player.ts
import { Router as Router2 } from "express";
var router2 = Router2();
router2.post("/sign-up", signUp);
router2.post("/sign-in", signIn2);
router2.get("/sign-out", authenticate, signOut2);
router2.post("/forgot-password", forgetPassword);
var player_default = router2;

// src/controllers/internal.ts
var deleteInstitutionAdmins = async (req, res) => {
  try {
    await prisma.admins.deleteMany({
      where: { institutionId: req.body.institutionId }
    });
    responseHandler(res, true, "Successful");
  } catch (e) {
    responseHandler(res, false, "", void 0, e);
  }
};

// src/routes/internal.ts
import { Router as Router3 } from "express";
var router3 = Router3();
router3.delete("/deleteInstitutionAdmins", deleteInstitutionAdmins);
var internal_default = router3;

// src/app.ts
import cors from "cors";
import express from "express";
var app = express();
app.set("trust proxy", 1);
var port = env.port;
app.use(cors());
app.use(express.json());
app.use("/admin", admin_default);
app.use("/player", player_default);
app.use("/internal", internal_default);
app.listen(port, (e) => {
  if (e) console.error(e);
  else console.log(`Server running on port: ${port}`);
});
//# sourceMappingURL=app.mjs.map