import { InstituicionRepository } from "../repositories/instituicion.repository";

const repository = new InstituicionRepository();

export class InstituicionService {
    getAll(page: number, limit: number) {
        return repository.findAll(page, limit);
    }

    getById(id: number) {
        return repository.findById(id);
    }

    create(data: any) {
        return repository.create(data);
    }

    update(id: number, data: any) {
        return repository.update(id, data);
    }

    delete(id: number) {
        return repository.delete(id);
    }
}
