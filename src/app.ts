import express from "express";
import cors from "cors";

import instituicionRoutes from "./routes/instituicion.routes";
import activityRoutes from "./routes/activity.routes";
import photosRoutes from "./routes/photos.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ Message: "olá mundo" });
});

app.use("/instituicion", instituicionRoutes);
app.use("/activities", activityRoutes);
app.use("/photos", photosRoutes);

export default app;
