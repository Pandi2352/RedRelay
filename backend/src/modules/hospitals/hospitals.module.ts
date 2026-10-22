import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HospitalsController } from './hospitals.controller';
import { HospitalsRepository } from './hospitals.repository';
import { HospitalsService } from './hospitals.service';
import { Hospital, HospitalSchema } from './schemas/hospital.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Hospital.name, schema: HospitalSchema }])],
  controllers: [HospitalsController],
  providers: [HospitalsRepository, HospitalsService],
  exports: [HospitalsService, HospitalsRepository],
})
export class HospitalsModule {}
