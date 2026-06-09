import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/auth.repository";

const JWT_SECRET = process.env.JWT_SECRET!;

interface LoginDTO {
    email: string;
    password: string;
}

export class AuthService {
    static async login(data: LoginDTO) {
        const user = await AuthRepository.findUserByEmail(data.email);

        if (!user) {
            throw new Error("Email ou senha inválidos");
        }

        const validPassword = await bcrypt.compare(data.password, user.password_hash);

        if (!validPassword) {
            throw new Error("Email ou senha inválidos");
        }

        const login = await AuthRepository.createLogin(user.id);

        const token = jwt.sign(
            {
                userId: user.id,
                loginId: login.id,
            },
            JWT_SECRET,
            {
                expiresIn: "30m",
            }
        );

        return {
            token,
            expiresAt: login.expires_at,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    static async logout(loginId: number) {
        const login = await AuthRepository.findLoginById(loginId);

        if (!login) {
            throw new Error("Sessão não encontrada");
        }

        await AuthRepository.deleteLogin(loginId);
    }
}
