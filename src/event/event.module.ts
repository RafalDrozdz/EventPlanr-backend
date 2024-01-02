import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { JwtModule } from '@nestjs/jwt';
import { configService } from '../config/config.service';
import { TypeOfTicketService } from '../type-of-ticket/type-of-ticket.service';
import { TypeOfTicket } from '../type-of-ticket/type-of-ticket.entity';
import { StripeService } from '../stripe/stripe.service';

const jwtOptions = configService.getJwtOptions();
const EventRepository = TypeOrmModule.forFeature([Event, TypeOfTicket]);
@Module({
  imports: [EventRepository, JwtModule.register(jwtOptions)],
  controllers: [EventController],
  providers: [EventService, TypeOfTicketService, StripeService],
  exports: [EventService, EventRepository],
})
export class EventModule {}
