import { Module } from '@nestjs/common';
import { BusinessController } from './business/business.controller';
import { BusinessService } from './business/business.service';

@Module({
  imports: [],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class AppModule {}
