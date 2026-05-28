import { db } from "../config/database";

import { Instituicion } from "../types/instituicion";
import { Activity } from "../types/Activities";

export interface InstituicionWithActivities extends Instituicion {
    activities: Activity[];
}

export class InstituicionRepository {
    async findAll(
        page: number,
        limit: number
    ): Promise<{
        data: InstituicionWithActivities[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }> {
        const offset = (page - 1) * limit;

        const institutions = await db<Instituicion>("Instituicion").select("*").limit(limit).offset(offset).orderBy("id", "desc");

        const ids = institutions.map((item) => item.id);

        const activities = ids.length > 0 ? await db<Activity>("Activities").select("*").whereIn("id_instituicion", ids) : [];

        const machines = ids.length > 0 ? await db<Activity>("InstitutionEquipment").select("*").whereIn("id_instituicion", ids) : [];

        const data: InstituicionWithActivities[] = institutions.map((institution) => ({
            ...institution,
            machine: machines.filter((machine) => machine.id_instituicion === institution.id),
            activities: activities.filter((activity) => activity.id_instituicion === institution.id),
        }));

        const totalResult = await db("Instituicion").count("id as total").first();

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
    async findById(id: number): Promise<InstituicionWithActivities | null> {
        const institution = await db<Instituicion>("Instituicion").where({ id }).first();

        if (!institution) {
            return null;
        }

        const activities = await db<Activity>("Activities").select("*").where({
            id_instituicion: id,
        });

        return {
            ...institution,
            activities,
        };
    }

    async create(data: Omit<InstituicionWithActivities, "id">) {
        const trx = await db.transaction();

        try {
            // =========================
            // SEPARATE DATA
            // =========================

            const { activities = [], ...institutionData } = data;

            // =========================
            // CREATE INSTITUTION
            // =========================

            const [createdInstitution] = await trx("Instituicion").insert(institutionData).returning("*");

            // =========================
            // CREATE ACTIVITIES
            // =========================

            if (activities.length > 0) {
                const activitiesToInsert = activities.map((activity) => ({
                    ...activity,

                    id_instituicion: createdInstitution.id,
                }));

                await trx("Activities").insert(activitiesToInsert);
            }

            await trx.commit();

            return await this.findById(createdInstitution.id);
        } catch (error) {
            await trx.rollback();

            throw error;
        }
    }

    async update(id: number, data: Partial<InstituicionWithActivities>) {
        const trx = await db.transaction();

        try {
            // =========================
            // SEPARATE DATA
            // =========================

            const { activities = [], id: _id, ...institutionData } = data;

            // =========================
            // UPDATE INSTITUTION
            // =========================

            await trx("Instituicion").where({ id }).update(institutionData);

            // =========================
            // REMOVE OLD ACTIVITIES
            // =========================

            await trx("Activities")
                .where({
                    id_instituicion: id,
                })
                .delete();

            // =========================
            // INSERT NEW ACTIVITIES
            // =========================

            if (activities.length > 0) {
                const activitiesToInsert = activities.map((activity) => ({
                    name: activity.name,

                    responsible: activity.responsible,

                    start_date: activity.start_date,

                    end_date: activity.end_date,

                    status: activity.status,

                    id_instituicion: id,
                }));

                await trx("Activities").insert(activitiesToInsert);
            }

            await trx.commit();

            return await this.findById(id);
        } catch (error) {
            await trx.rollback();

            throw error;
        }
    }

    async delete(id: number) {
        const trx = await db.transaction();

        try {
            // =========================
            // DELETE ACTIVITIES
            // =========================

            await trx("Activities")
                .where({
                    id_instituicion: id,
                })
                .delete();

            // =========================
            // DELETE INSTITUTION
            // =========================

            await trx("Instituicion").where({ id }).delete();

            await trx.commit();

            return true;
        } catch (error) {
            await trx.rollback();

            throw error;
        }
    }
}
