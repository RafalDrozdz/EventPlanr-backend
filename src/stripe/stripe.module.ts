import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { configService } from '../config/config.service';

const jwtOptions = configService.getJwtOptions();

@Module({
  imports: [JwtModule.register(jwtOptions)],
  controllers: [StripeController],
  providers: [JwtService, StripeService],
})
export class StripeModule {}
