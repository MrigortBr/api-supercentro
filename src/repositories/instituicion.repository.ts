import { db } from "../config/database";

import { Instituicion } from "../types/instituicion";
import { Activity, ObservationActivities } from "../types/Activities";

export interface InstitutionObservation {
    id?: number;
    institution_id?: number;
    description: string;
    created_at?: Date;
}

export interface InstituicionWithActivities extends Omit<Instituicion, "observations"> {
    observations: InstitutionObservation[];
    activities: Activity[];
    machine?: any[];
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

        const institutions = await db("Instituicion").select("*").limit(limit).offset(offset).orderBy("id", "desc");

        const institutionIds = institutions.map((item) => item.id);

        const institutionObservations =
            institutionIds.length > 0
                ? await db<InstitutionObservation>("InstituicionObservation").select("*").whereIn("institution_id", institutionIds)
                : [];

        const activities =
            institutionIds.length > 0
                ? await db<Omit<Activity, "observation">>("Activities").select("*").whereIn("id_instituicion", institutionIds)
                : [];

        const activityIds = activities.map((activity) => activity.id);

        const observations =
            activityIds.length > 0 ? await db<ObservationActivities>("ObservationActivities").select("*").whereIn("id_activities", activityIds) : [];

        const machines = institutionIds.length > 0 ? await db("InstitutionEquipment").select("*").whereIn("id_instituicion", institutionIds) : [];

        const activitiesWithObservations: Activity[] = activities.map((activity) => ({
            ...activity,
            observation: observations.filter((obs) => obs.id_activities === activity.id),
        }));

        const data: InstituicionWithActivities[] = institutions.map((institution) => ({
            ...institution,

            observations: institutionObservations.filter((obs) => obs.institution_id === institution.id),

            machine: machines.filter((machine) => machine.id_instituicion === institution.id),

            activities: activitiesWithObservations.filter((activity) => activity.id_instituicion === institution.id),
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
        const institution = await db("Instituicion").where({ id }).first();

        if (!institution) {
            return null;
        }

        const institutionObservations = await db<InstitutionObservation>("InstituicionObservation")
            .where({
                institution_id: id,
            })
            .orderBy("created_at", "desc");

        const activitiesRaw = await db("Activities")
            .select("Activities.*", "o.id as observation_id", "o.id_activities", "o.date_observation", "o.text_observation")
            .where({
                id_instituicion: id,
            })
            .leftJoin("ObservationActivities as o", "o.id_activities", "Activities.id");

        const activitiesMap = new Map<number, Activity>();

        for (const row of activitiesRaw) {
            let activity = activitiesMap.get(row.id);

            if (!activity) {
                activity = {
                    id: row.id,
                    id_instituicion: row.id_instituicion,
                    name: row.name,
                    responsible: row.responsible,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    status: row.status,
                    observation: [],
                };

                activitiesMap.set(row.id, activity);
            }

            if (row.observation_id) {
                (activity.observation ??= []).push({
                    id: row.observation_id,
                    id_activities: row.id_activities,
                    date_observation: row.date_observation,
                    text_observation: row.text_observation,
                });
            }
        }

        const activities = [...activitiesMap.values()];

        const machines = await db("InstitutionEquipment").where({
            id_instituicion: id,
        });

        return {
            ...institution,
            observations: institutionObservations,
            machine: machines,
            activities,
        };
    }

    async create(data: Omit<InstituicionWithActivities, "id">) {
        const trx = await db.transaction();

        try {
            const { activities = [], machine = [], observations = [], ...institutionData } = data;

            const [createdInstitution] = await trx("Instituicion").insert(institutionData).returning("*");

            if (observations.length > 0) {
                await trx("InstituicionObservation").insert(
                    observations.map((obs) => ({
                        institution_id: createdInstitution.id,
                        description: obs.description,
                    }))
                );
            }

            for (const activity of activities) {
                const { observation = [], ...activityData } = activity;

                const [createdActivity] = await trx("Activities")
                    .insert({
                        ...activityData,
                        start_date: activity.start_date === "" ? null : activity.start_date,
                        end_date: activity.end_date === "" ? null : activity.end_date,
                        id_instituicion: createdInstitution.id,
                    })
                    .returning("*");

                if (observation.length > 0) {
                    await trx("ObservationActivities").insert(
                        observation.map((obs) => ({
                            id_activities: createdActivity.id,
                            date_observation: obs.date_observation,
                            text_observation: obs.text_observation,
                        }))
                    );
                }
            }

            if (machine.length > 0) {
                const machinesToInsert = machine.map((m) => ({
                    ...m,
                    previsao_entrega: m.previsao_entrega === "" ? null : m.previsao_entrega,
                    id_instituicion: createdInstitution.id,
                }));

                await trx("InstitutionEquipment").insert(machinesToInsert);
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
            const { activities = [], machine = [], observations = [], id: _id, ...institutionData } = data;

            await trx("Instituicion").where({ id }).update(institutionData);

            await trx("InstituicionObservation")
                .where({
                    institution_id: id,
                })
                .delete();

            if (observations.length > 0) {
                await trx("InstituicionObservation").insert(
                    observations.map((obs) => ({
                        institution_id: id,
                        description: obs.description,
                    }))
                );
            }

            await trx("Activities")
                .where({
                    id_instituicion: id,
                })
                .delete();

            for (const activity of activities) {
                const { observation = [], ...activityData } = activity;

                const [createdActivity] = await trx("Activities")
                    .insert({
                        ...activityData,
                        start_date: activity.start_date === "" ? null : activity.start_date,
                        end_date: activity.end_date === "" ? null : activity.end_date,
                        id_instituicion: id,
                    })
                    .returning("*");

                if (observation.length > 0) {
                    await trx("ObservationActivities").insert(
                        observation.map((obs) => ({
                            id_activities: createdActivity.id,
                            date_observation: obs.date_observation,
                            text_observation: obs.text_observation,
                        }))
                    );
                }
            }

            await trx("InstitutionEquipment")
                .where({
                    id_instituicion: id,
                })
                .delete();

            if (machine.length > 0) {
                const machinesToInsert = machine.map((m) => ({
                    ...m,
                    previsao_entrega: m.previsao_entrega === "" ? null : m.previsao_entrega,
                    id_instituicion: id,
                }));

                await trx("InstitutionEquipment").insert(machinesToInsert);
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
            await trx("Activities")
                .where({
                    id_instituicion: id,
                })
                .delete();

            await trx("InstituicionObservation")
                .where({
                    institution_id: id,
                })
                .delete();

            await trx("InstitutionEquipment")
                .where({
                    id_instituicion: id,
                })
                .delete();

            await trx("Instituicion").where({ id }).delete();

            await trx.commit();

            return true;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }
}
