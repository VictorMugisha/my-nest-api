import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthMiddleware } from './middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }), // Global config module
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('users');
  }
}
