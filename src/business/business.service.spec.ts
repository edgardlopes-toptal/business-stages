import { Test, TestingModule } from '@nestjs/testing';
import { BusinessService } from './business.service';
import { Business } from '../entities/Business.entity';
import { Stage } from '../entities/Stage.enum';

describe('BusinessService', () => {
  let service: BusinessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessService],
    }).compile();

    service = module.get<BusinessService>(BusinessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Insert', () => {
    it('should insert a business with "New" stage', () => {
      const business = {
        name: 'acme',
        fein: 123
      }
      
      service.create(business as Business);
      
      const {stage, ...stored} = service.findByFein(123);
      
      expect(stage).toEqual(Stage.New);
      expect(stored).toEqual(business)
    })
  })

  describe('Transition', () => {

    it('Should throw error if the business is not stored', () => {
      const business = {
        name: 'acme',
        fein: 123
      }
      
      try {
        service.transitionBusiness(business as Business);
      } catch (e) {
        expect(e).toEqual(new Error('Not found'))
      }

      expect.assertions(1)
    })

  })

});
