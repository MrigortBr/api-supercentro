import { Request, Response } from "express";
import { ActivityService } from "../services/activity.service";
import { MachineService } from "../services/machine.service";

const service = new MachineService();

export class machineController {
    async findById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const data = service.findById(id);

            if (!data) {
                return res.status(404).json({
                    message: "Maquina não encontrada",
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
            const result = await service.create(req.body);

            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const result = await service.update(Number(id), req.body);

            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const result = await service.delete(Number(id));

            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }
}
