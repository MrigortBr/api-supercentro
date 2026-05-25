import { Router } from "express";
import { InstituicionController } from "../controllers/instituicion.controller";

const routes = Router();
const controller = new InstituicionController();

routes.get("/", controller.findAll);
routes.get("/:id", controller.findById);
routes.post("/", controller.create);
routes.put("/:id", controller.update);
routes.delete("/:id", controller.delete);

export default routes;
