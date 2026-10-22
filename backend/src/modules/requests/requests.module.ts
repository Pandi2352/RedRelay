import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HospitalsModule } from '../hospitals/hospitals.module';
import { RequestsController } from './requests.controller';
import { RequestsRepository } from './requests.repository';
import { RequestsService } from './requests.service';
import { BloodRequest, BloodRequestSchema } from './schemas/blood-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BloodRequest.name, schema: BloodRequestSchema }]),
    HospitalsModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsRepository, RequestsService],
  exports: [RequestsService, RequestsRepository],
})
export class RequestsModule {}
