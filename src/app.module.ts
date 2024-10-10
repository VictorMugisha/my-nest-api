import { Logger, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('MongooseModule');

        return {
          uri: configService.get<string>('MONGO_URI'),
          connectionFactory: (connection) => {
            connection.once('open', () => {
              logger.log('MongoDB Connected');
            });

            connection.on('error', (err) => {
              logger.error(`MongoDB Connection Error: ${err}`);
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
