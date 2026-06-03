export type ActivityStatus = "Projetado" | "Em andamento" | "Concluído";

export interface Activity {
    id: number;
    id_instituicion: number;
    name: string;
    observation?: ObservationActivities[];
    responsible: number | null;
    start_date: Date | null | "";
    end_date: Date | null | "";
    status: ActivityStatus;
}

export interface ObservationActivities {
    id: number;
    id_activities: number;
    date_observation: Date | null;
    text_observation: string | null;
}
