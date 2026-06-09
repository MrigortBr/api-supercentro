import { Router } from "express";
import { InstituicionController } from "../controllers/instituicion.controller";
import { machineController } from "../controllers/machine.controller";

const routes = Router();
const controller = new machineController();

// routes.get("/:id", controller.findById);
// routes.post("/:id", controller.create);
// routes.put("/:id", controller.update);
// routes.delete("/:id", controller.delete);

export default routes;
