import { Stage } from "../entities/Stage.enum";

export type StageTransition = {
    next: Stage[];
    previous: Stage[]
}

// Empty arrays, means it is the last or first step
export const stageTransitions: Record<Stage, StageTransition> = {
    New: {
        next:[Stage.SalesDeclined, Stage.MarketDeclined],
        previous: []
    },
    SalesDeclined: {
        next: [Stage.SalesApproved],
        previous: [Stage.New]
    },
    MarketDeclined: {
        next: [],
        previous: [Stage.New]
    },
    SalesApproved: {
        next: [],
        previous: [Stage.SalesDeclined]
    },
}

export const requiredFieldsPerStage: Record<Stage, string[]> = {
    New: ["fein", "name"],
    SalesDeclined: ["classification"],
    MarketDeclined: ["classification"],
    SalesApproved: ["phoneNumber", "xMod"],
}