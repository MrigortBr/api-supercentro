import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import instituicionRoutes from "./routes/instituicion.routes";
import activityRoutes from "./routes/activity.routes";
import authRoutes from "./routes/auth.routes";
import photosRoutes from "./routes/photos.routes";
import machineRoutes from "./routes/machine.routes";
import { swaggerSpec } from "./swagger";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.json({ Message: "olá mundo" });
});

app.use("/instituicion", instituicionRoutes);
// app.use("/activities", activityRoutes);
app.use("/auth", authRoutes);

app.use("/photos", photosRoutes);
// app.use("/machine", machineRoutes);

export default app;
