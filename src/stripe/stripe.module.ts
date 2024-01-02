import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { JwtModule } from '@nestjs/jwt';
import { configService } from '../config/config.service';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { EventService } from '../event/event.service';
import { EventModule } from '../event/event.module';

const jwtOptions = configService.getJwtOptions();

@Module({
  imports: [JwtModule.register(jwtOptions), MailModule, EventModule],
  controllers: [StripeController],
  providers: [StripeService, MailService, EventService],
})
export class StripeModule {}
