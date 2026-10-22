import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common';
import { configNamespaces, validateEnv } from './config';
import { DatabaseModule } from './infra/database/database.module';
import { LoggerModule } from './infra/logger/logger.module';
import { HealthModule } from './modules/health/health.module';
import { HospitalsModule } from './modules/hospitals';
import { RequestsModule } from './modules/requests';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate: validateEnv, load: configNamespaces }),
    LoggerModule,
    DatabaseModule,
    CommonModule,
    HealthModule,
    HospitalsModule,
    RequestsModule,
  ],
})
export class AppModule {}
