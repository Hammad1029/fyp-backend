import appRouter from "@/api.js";
import * as constants from "@/utils/constants.js";
import cors from "cors";
import express from "express";

const app = express();

app.set("trust proxy", 1);

const port = constants.env.port;
app.use(cors());
app.use(express.json());

app.use(appRouter);

app.listen(port, (e) => {
  if (e) console.error(e);
  else console.log(`Server running on port: ${port}`);
});
