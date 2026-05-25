import { Activity } from "./Activities";

export interface Instituicion {
    id: number;
    name: string;
    state: string;
    responsible: string;
    status: string;
    observations: string | null;
}

export interface InstituicionWithActivities {
    id: number;
    name: string;
    state: string;
    responsible: string;
    status: string;
    observations: string | null;

    activities: Activity[];
}
