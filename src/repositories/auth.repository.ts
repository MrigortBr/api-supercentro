// repositories/AuthRepository.ts

import { db } from "../config/database";

export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

export interface UserLogin {
    id: number;
    user_id: number;
    login_at: Date;
    expires_at: Date;
}

export class AuthRepository {
    static async findUserByEmail(email: string): Promise<User | undefined> {
        return await db<User>("users").where({ email }).first();
    }

    static async findUserById(id: number): Promise<User | undefined> {
        return await db<User>("users").where({ id }).first();
    }

    static async createLogin(userId: number): Promise<UserLogin> {
        const [login] = await db<UserLogin>("user_logins")
            .insert({
                user_id: userId,
            })
            .returning("*");

        return login;
    }

    static async findLoginById(loginId: number): Promise<UserLogin | undefined> {
        return await db<UserLogin>("user_logins").where({ id: loginId }).first();
    }

    static async findActiveLogin(loginId: number): Promise<UserLogin | undefined> {
        return await db<UserLogin>("user_logins").where({ id: loginId }).where("expires_at", ">", db.fn.now()).first();
    }

    static async deleteLogin(loginId: number): Promise<number> {
        return await db("user_logins").where({ id: loginId }).del();
    }

    static async deleteAllUserLogins(userId: number): Promise<number> {
        return await db("user_logins").where({ user_id: userId }).del();
    }
}
