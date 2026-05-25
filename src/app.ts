import express from "express";
import cors from "cors";

import instituicionRoutes from "./routes/instituicion.routes";
import activityRoutes from "./routes/activity.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/instituicion", instituicionRoutes);
app.use("/activities", activityRoutes);

export { app };
