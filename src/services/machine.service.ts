import { InstituicionRepository } from "../repositories/instituicion.repository";
import { InstitutionEquipment, MachineRepository } from "../repositories/machine.repository";

const repository = new MachineRepository();

export class MachineService {
    findById(id: number) {
        return repository.findByIdInst(id);
    }

    async create(data: InstitutionEquipment) {
        if (!data.simb) {
            throw new Error("SIMB obrigatório");
        }

        if (!data.descricao) {
            throw new Error("Descrição obrigatória");
        }

        return await repository.create(data);
    }

    async update(id: number, data: Partial<InstitutionEquipment>) {
        const equipment = await repository.findById(id);

        if (!equipment) {
            throw new Error("Equipamento não encontrado");
        }

        return await repository.update(id, data);
    }

    async delete(id: number) {
        const equipment = await repository.findById(id);

        if (!equipment) {
            throw new Error("Equipamento não encontrado");
        }

        await repository.delete(id);

        return {
            message: "Equipamento removido",
        };
    }
}
