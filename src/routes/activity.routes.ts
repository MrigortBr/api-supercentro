import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller";

const routes = Router();
const controller = new ActivityController();

routes.get("/", controller.findAll);
routes.get("/:id", controller.findById);
routes.post("/", controller.create);
routes.put("/:id", controller.update);
routes.delete("/:id", controller.delete);

export default routes;
