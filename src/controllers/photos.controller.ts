import { Request, Response } from "express";
import { ActivityService } from "../services/activity.service";
import { InstituicionRepository } from "../repositories/instituicion.repository";
import { PhotoService } from "../services/photos.service";

const service = new PhotoService();

export class PhotosController {
    async listById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await service.validateInstituicion(Number(id));
            const response = await service.listById(Number(id));
            return res.status(200).send(response);
        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!req.file) {
                return res.status(400).json({
                    error: "Imagem obrigatória",
                });
            }

            await service.create(Number(id), req);

            return res.status(204).send();
        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    async update(req: Request, res: Response) {
        try {
            return res.status(204).send();
        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const response = await service.delete(Number(id));

            return res.status(204).send("Imagem deletada com sucesso");
        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
}
