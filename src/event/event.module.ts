import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { JwtModule } from '@nestjs/jwt';
import { configService } from '../config/config.service';
import { TypeOfTicketService } from '../type-of-ticket/type-of-ticket.service';
import { TypeOfTicket } from '../type-of-ticket/type-of-ticket.entity';
import { PaymentService } from '../payment/payment.service';

const jwtOptions = configService.getJwtOptions();

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, TypeOfTicket]),
    JwtModule.register(jwtOptions),
  ],
  controllers: [EventController],
  providers: [EventService, TypeOfTicketService, PaymentService],
})
export class EventModule {}
