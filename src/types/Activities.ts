export type ActivityStatus = "Projetado" | "Em andamento" | "Concluído";

export interface Activity {
    id: number;
    id_instituicion: number;
    name: string;
    responsible: number | null;
    start_date: Date | null | "";
    end_date: Date | null | "";
    status: ActivityStatus;
}
