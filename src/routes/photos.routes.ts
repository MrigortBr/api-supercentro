import { Router } from "express";
import { InstituicionController } from "../controllers/instituicion.controller";
import { PhotosController } from "../controllers/photos.controller";
import { upload } from "../multer";

const routes = Router();
const controller = new PhotosController();

routes.get("/:id", controller.listById);
routes.post("/:id", upload.single("file"), controller.create);
// routes.put("/:id", controller.update);
routes.delete("/:id", controller.delete);

export default routes;
