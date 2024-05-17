import { Stage } from "./Stage.enum";

export type Business = {
    fein: number;
    name: string;
    classification?: {
        bureau: string;
        classCode: string;
    };
    phoneNumber?: string;
    xMod?: number;
    stage: Stage;
}