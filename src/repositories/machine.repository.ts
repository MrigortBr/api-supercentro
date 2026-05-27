import { db } from "../config/database";

import { Instituicion } from "../types/instituicion";
import { Activity } from "../types/Activities";

export type InstitutionEquipment = {
    id: number;
    id_instituicion: number;
    simb: string;
    descricao: string;
    status: string;
    marca?: string | null;
    quantidade: number;
    previsao_entrega?: Date | null;
    created_at: Date;
};

export class MachineRepository {
    async findByIdInst(id_instituicion: number): Promise<InstitutionEquipment[]> {
        return await db<InstitutionEquipment>("InstitutionEquipment").where({ id_instituicion });
    }

    async create(item: InstitutionEquipment) {
        return await db("InstitutionEquipment")
            .insert({
                id_instituicion: item.id_instituicion,
                simb: item.simb,
                descricao: item.descricao,
                status: item.status,
                marca: item.marca,
                quantidade: item.quantidade,
                previsao_entrega: item.previsao_entrega,
            })
            .returning("*");
    }

    async update(id: number, item: Partial<InstitutionEquipment>) {
        return await db("InstitutionEquipment")
            .where({ id })
            .update({
                simb: item.simb,
                descricao: item.descricao,
                status: item.status,
                marca: item.marca,
                quantidade: item.quantidade,
                previsao_entrega: item.previsao_entrega,
            })
            .returning("*");
    }

    async delete(id: number) {
        return await db("InstitutionEquipment").where({ id }).delete();
    }

    async findById(id: number) {
        return await db("InstitutionEquipment").where({ id }).first();
    }
}
