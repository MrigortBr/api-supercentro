import { Request, Response } from "express";
import { ActivityService } from "../services/activity.service";

const service = new ActivityService();

export class ActivityController {
    async findAll(req: Request, res: Response) {
        try {
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 10);

            const data = await service.getAll(page, limit);

            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const data = await service.getById(id);

            if (!data) {
                return res.status(404).json({
                    message: "Activity não encontrada",
                });
            }

            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const data = await service.create(req.body);

            return res.status(201).json(data);
        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const data = await service.update(id, req.body);

            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            await service.delete(id);

            return res.status(204).send();
        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
}
