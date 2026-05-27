import express from "express";
import cors from "cors";

import instituicionRoutes from "./routes/instituicion.routes";
import activityRoutes from "./routes/activity.routes";
import photosRoutes from "./routes/photos.routes";
import machineRoutes from "./routes/machine.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ Message: "olá mundo" });
});

app.use("/instituicion", instituicionRoutes);
app.use("/activities", activityRoutes);
app.use("/photos", photosRoutes);
app.use("/machine", machineRoutes);

export default app;
