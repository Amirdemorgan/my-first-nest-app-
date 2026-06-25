import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_SECRET')!,

        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ??
            '1d') as any,
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy],

  exports: [JwtModule, JwtStrategy],
})
export class AuthModule {}
