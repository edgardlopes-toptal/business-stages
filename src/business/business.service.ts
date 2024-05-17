import { Injectable } from '@nestjs/common';
import { Business } from '../entities/Business.entity';
import { Stage } from '../entities/Stage.enum';
import { isPhoneValid } from '../validations/phone.validation';
import { stageTransitions } from '../contants/transition.contants';


type ValidationResult = {
    hasError: boolean;
    message?: string;
}

const declinedClassifications = ["9079", "8078"];

function validateClassification(classification: {bureau: string; classCode: string}): ValidationResult {
    if(!classification?.bureau) {
        return { hasError: true, message: 'classification.bureau is required'};
    }

    if(!classification?.classCode) {
        return { hasError: true, message: 'classification.classCode is required'};
    }

    return { hasError: false };
}

const stageValidations: Record<Stage, (Business) => ValidationResult > = {
    New: (business: Business) => {
        if(!business.name) {
            return {hasError: true, message: 'name is required'}
        }

        if(!business.fein) {
            return {hasError: true, message: 'fein is required'}
        }

        return { hasError: false }
    },
    MarketDeclined: (business: Business) => {
        const validation = validateClassification(business?.classification)
        if(validation.hasError) {
            return validation
        }

        if(!declinedClassifications.includes(business.classification.classCode)) {
            return { hasError: true, message: `cannot set MarketDeclined with ${business.classification.classCode}` }
        }

        return { hasError: false }
    },
    SalesApproved: (business: Business) => {
        if(!business.xMod) {
            return { hasError: true, message: "xMod is required"};
        }

        if(!business.phoneNumber) {
            return { hasError: true, message: "phoneNumber is required"};
        }

        if(!isPhoneValid(business.phoneNumber)) {
            return { hasError: true, message: "phoneNumber is invalid"};
        }

        return { hasError: false };
    },
    SalesDeclined: (business: Business) => {
        const validation = validateClassification(business?.classification)
        if(validation.hasError) {
            return validation
        }

        if(declinedClassifications.includes(business.classification.classCode)) {
            return { hasError: true, message: `cannot set SalesDeclined with ${business.classification.classCode}` }
        }

        return { hasError: false }
    }
}

@Injectable()
export class BusinessService {

    private businesses: Business[] = [];

    findAllBusinesses(): Business[] {
        return this.businesses;
    }

    findByFein(fein: number): Business {
        return this.businesses.find(b => b.fein === fein);
    }

    create(business: Business) {
        const stored = this.businesses.find(b => b.fein === business.fein);
        if(stored) {
            throw new Error(`Business with fein ${business.fein} already exists`);
        }
        const validation = stageValidations[Stage.New](business)
        if(validation.hasError) {
            throw new Error(validation.message);
        }
        this.businesses.push({ ...business, stage: Stage.New });
    }

    transitionBusiness(business: Business) {
        const stored = this.businesses.find(b => b.fein === business.fein);
        if(!stored) {
            throw new Error("Not found");
        }

        if(!stageTransitions[stored.stage].next.includes(business.stage) && !stageTransitions[stored.stage].previous.includes(business.stage)){
            throw new Error(`Cannot move from ${stored.stage} to ${business.stage}`)
        }

        const stageValidation = stageValidations[business.stage](business);
        if(stageValidation.hasError) {
            throw new Error(stageValidation.message)
        }

        this.businesses = [
            ...this.businesses.filter(b => b.fein !== business.fein),
            {...stored, ...business}
        ]
    }

}
