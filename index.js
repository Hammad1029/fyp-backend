import express from "express";
import appRouter from "./routes/index.js";
import passport from "passport";
import "@/utils/passport.js";
import session from "express-session";
import * as constants from "@/utils/constants.js";
import cors from "cors";
const app = express();
const port = constants.env.port;
app.use(cors()); // Allow all origins
app.use(express.json());
app.use(session({ secret: constants.env.sessionSecret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(appRouter);
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
//# sourceMappingURL=index.js.map