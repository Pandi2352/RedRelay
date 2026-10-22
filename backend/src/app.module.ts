import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { CommonModule } from './common';
import { JwtAuthGuard } from './common/guards';
import { configNamespaces, validateEnv } from './config';
import { DatabaseModule } from './infra/database/database.module';
import { LoggerModule } from './infra/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { HospitalsModule } from './modules/hospitals';
import { RequestsModule } from './modules/requests';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate: validateEnv, load: configNamespaces }),
    LoggerModule,
    DatabaseModule,
    CommonModule,
    UsersModule,
    AuthModule,
    HealthModule,
    HospitalsModule,
    RequestsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
