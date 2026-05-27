import { Request } from "express";
import { ActivityRepository } from "../repositories/activity.repository";
import { InstituicionRepository } from "../repositories/instituicion.repository";
import { InstitutionPhoto, PhotosRepository } from "../repositories/photos.repository";

const repositoryInst = new InstituicionRepository();
const repository = new PhotosRepository();

export class PhotoService {
    async listById(id: number) {
        return await repository.listByIdInstituicion(id);
    }

    async create(id: number, req: Request) {
        try {
            if (!req.file) {
                throw new Error("Arquivo enviado é invalido!");
            }

            const image: InstitutionPhoto = {
                id: 0,
                id_instituicion: id,
                original_name: req.file.filename,
                size: req.file.size,
                mime_type: req.file.mimetype,
                photo: req.file.buffer,
                created_at: new Date(),
            };

            return await repository.create(image);
        } catch (err) {
            throw Error("Dados enviados são invalidos!");
        }
    }

    async validateInstituicion(id: number) {
        const instituicion = await repositoryInst.findById(id);

        if (!instituicion) {
            throw new Error("Instituição não encontrada");
        }
    }

    async delete(id: number) {
        return await repository.delete(id);
    }
}
