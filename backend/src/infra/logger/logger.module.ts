import { Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { appConfig } from '../../config';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (app: ConfigType<typeof appConfig>) => ({
        pinoHttp: {
          level: app.logLevel,
          transport: app.isProduction ? undefined : { target: 'pino-pretty', options: { singleLine: true } },
          redact: ['req.headers.authorization', 'req.headers.cookie'],
          autoLogging: app.env !== 'test',
        },
      }),
    }),
  ],
})
export class LoggerModule {}
