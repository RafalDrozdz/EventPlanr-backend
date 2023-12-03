import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user.entity';
import { EventService } from '../event/event.service';
import { EventModule } from '../event/event.module';
import { Event } from '../event/event.entity';
import { Ticket } from '../ticket/ticket.entity';
import { TypeOfTicket } from '../type-of-ticket/type-of-ticket.entity';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([User, Event, Ticket, TypeOfTicket]),
    AuthModule,
    EventModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, EventService],
})
export class AppModule {}
