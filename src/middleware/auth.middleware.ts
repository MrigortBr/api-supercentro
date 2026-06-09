import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/auth.repository";

const JWT_SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
    userId: number;
    loginId: number;
    iat: number;
    exp: number;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token não informado",
            });
        }

        const [, token] = authHeader.split(" ");

        if (!token) {
            return res.status(401).json({
                message: "Token inválido",
            });
        }

        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

        const login = await AuthRepository.findActiveLogin(payload.loginId);

        if (!login) {
            return res.status(401).json({
                message: "Sessão expirada ou inválida",
            });
        }

        req.user = {
            userId: payload.userId,
            loginId: payload.loginId,
        };

        next();
    } catch {
        return res.status(401).json({
            message: "Não autorizado",
        });
    }
}
