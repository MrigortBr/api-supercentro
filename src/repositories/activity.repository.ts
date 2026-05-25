import { db } from "../config/database";
import { Activity } from "../types/Activities";

export class ActivityRepository {
    async findAll(page: number, limit: number) {
        const offset = (page - 1) * limit;

        const data = await db("Activities as a")
            .leftJoin("Instituicion as i", "i.id", "a.id_instituicion")
            .select("a.*", "i.name as instituicion_name", "i.state")
            .limit(limit)
            .offset(offset);

        const totalResult = await db("Activities").count("id as total").first();

        const total = Number(totalResult?.total || 0);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findById(id: number) {
        return await db("Activities as a")
            .leftJoin("Instituicion as i", "i.id", "a.id_instituicion")
            .select("a.*", "i.name as instituicion_name", "i.state")
            .where("a.id", id)
            .first();
    }

    async create(data: Omit<Activity, "id">) {
        return await db("Activities").insert(data).returning("*");
    }

    async update(id: number, data: Partial<Activity>) {
        return await db("Activities").where({ id }).update(data).returning("*");
    }

    async delete(id: number) {
        return await db("Activities").where({ id }).delete();
    }
}
