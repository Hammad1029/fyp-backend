import express from "express";
import appRouter from "./routes/index.js";
import passport from "passport";
import "@/utils/passport.js";
import session from "express-session";
import * as constants from "@/utils/constants.js";
import cors from "cors";

const app = express();

app.set("trust proxy", 1);

app.use(
  session({
    secret: constants.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const port = constants.env.port;
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (!req.session) res.status(401);
  else next();
});

app.use(appRouter);

app.listen(port, (e) => {
  if (e) console.error(e);
  else console.log(`Server running on port: ${port}`);
});
