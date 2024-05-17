import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Business } from '../entities/Business.entity';
import { BusinessService } from './business.service';
import { Response } from 'express';
import { Stage } from '../entities/Stage.enum';
import { requiredFieldsPerStage, stageTransitions } from 'src/contants/transition.contants';

@Controller('businessess')
export class BusinessController {

    constructor(private readonly service: BusinessService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    createBusiness(@Body() business: Business, @Res() response: Response) {
        try {
            this.service.create(business); 

            response.send({
                next: stageTransitions[Stage.New].next.reduce((acm, currStage) => ({...acm, [currStage]: requiredFieldsPerStage[currStage]}), {}),
                previous: stageTransitions[Stage.New].previous
            })
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message)
        }   
    }   


    @Get()
    fetchAll(): Business[] {
        return this.service.findAllBusinesses();
    }

    @Get("/:fein")
    fetchByFein(@Param("fein") fein: number): Business {
        return this.service.findByFein(Number(fein));
    }

    @Put("/:fein")
    updateBusiness(@Param("fein") fein: number, @Body() business: Business, @Res() response: Response) {
        try {
            this.service.transitionBusiness({...business, fein: Number(fein)});
            response.send({
                next: stageTransitions[business.stage].next.reduce((acm, currStage) => ({...acm, [currStage]: requiredFieldsPerStage[currStage]}), {}),
                previous: stageTransitions[business.stage].previous
            })
        } catch (error) {
            response.status(500).send(error.message)
        }
    }
    

}
