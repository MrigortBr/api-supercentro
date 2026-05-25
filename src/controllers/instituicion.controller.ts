import { Request, Response } from "express";
import { InstituicionService } from "../services/instituicion.service";

const service = new InstituicionService();

export class InstituicionController {
    async findAll(req: Request, res: Response) {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);

        const data = await service.getAll(page, limit);

        return res.json(data);
    }

    async findById(req: Request, res: Response) {
        const data = await service.getById(Number(req.params.id));

        return res.json(data);
    }

    async create(req: Request, res: Response) {
        const data = await service.create(req.body);

        return res.status(201).json(data);
    }

    async update(req: Request, res: Response) {
        const data = await service.update(Number(req.params.id), req.body);

        return res.json(data);
    }

    async delete(req: Request, res: Response) {
        await service.delete(Number(req.params.id));

        return res.status(204).send();
    }
}
