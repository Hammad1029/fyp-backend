import attemptRouter from "@/routes/attempt";
import statsRouter from "@/routes/stats";
import * as constants from "@/utils/constants.js";
import cors from "cors";
import express from "express";

const app = express();

app.set("trust proxy", 1);

const port = constants.env.port;
app.use(cors());
app.use(express.json());

app.use("/", attemptRouter);
app.use("/stats", statsRouter);

app.listen(port, (e) => {
  if (e) console.error(e);
  else console.log(`Server running on port: ${port}`);
});
