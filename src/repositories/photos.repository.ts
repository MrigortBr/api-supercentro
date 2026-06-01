import { db } from "../config/database";

export type InstitutionPhoto = {
    id: number;
    id_instituicion: number;

    photo: Buffer;

    original_name?: string | null;
    mime_type?: string | null;
    size?: number | null;

    created_at: Date;
};

export class PhotosRepository {
    async listByIdInstituicion(id: number) {
        return await db("InstitutionPhoto as i").select().where("i.id_instituicion", id);
    }

    async create(item: InstitutionPhoto) {
        await db("InstitutionPhoto").insert({
            id_instituicion: item.id_instituicion,
            original_name: item.original_name,
            size: item.size,
            mime_type: item.mime_type,
            photo: item.photo,
            created_at: item.created_at,
        });
    }

    async delete(id: number) {
        return await db("InstitutionPhoto as i").delete().where("i.id", id);
    }
}
