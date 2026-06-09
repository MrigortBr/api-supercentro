import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const result = await AuthService.login(req.body);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(401).json({
                message: error.message,
            });
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            const loginId = req.user?.loginId;

            if (!loginId) {
                return res.status(401).json({
                    message: "Não autenticado",
                });
            }

            await AuthService.logout(loginId);

            return res.status(200).json({
                message: "Logout realizado com sucesso",
            });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message,
            });
        }
    }
}
