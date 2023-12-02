import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { EventService } from './event.service';
import { TypeOfTicketService } from '../type-of-ticket/type-of-ticket.service';
import { PaymentService } from '../payment/payment.service';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

@Controller('event')
export class EventController {
  constructor(
    private eventService: EventService,
    private typeOfTicketService: TypeOfTicketService,
    private jwtService: JwtService,
    private paymentService: PaymentService,
  ) {}
  @Post()
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() request: Request,
  ) {
    const cookieAccessToken = request.cookies['accessToken'];
    const user = await this.jwtService.verifyAsync(cookieAccessToken);

    const DEFAULT_STATUS = 'up_to_date';

    const event = await this.eventService.create({
      ...createEventDto,
      status: DEFAULT_STATUS,
      creator_user_id: user.id,
    });

    const ticketPromises = createEventDto.tickets.map((typeOfTicket) =>
      this.typeOfTicketService.create({ ...typeOfTicket, event_id: event.id }),
    );
    const tickets = await Promise.all(ticketPromises);
    console.log(tickets);
    const productPromises = tickets.map((ticket) =>
      this.paymentService.createProduct(ticket, event.title),
    );

    const products = await Promise.all(productPromises);

    return { ...event, tickets };
  }

  @Get(':id')
  async getEvent(@Param('id') id: number, @Req() request: Request) {
    const cookieAccessToken = request.cookies['accessToken'];
    const user = await this.jwtService.verifyAsync(cookieAccessToken);

    const event = await this.eventService.findOne({ where: { id } });
    const is_owner = user?.id === event.creator_user_id;
    const tickets = await this.typeOfTicketService.getTickets(id);
    const cheapest_ticket = await this.typeOfTicketService.getCheapestTicket(
      id,
    );

    return { ...event, is_owner, tickets, cheapest_ticket };
  }

  @Get()
  async all(@Req() request: Request) {
    return this.eventService.getAll();
  }

  @Get('search/:searchQuery')
  async search(
    @Param('searchQuery') searchQuery: string,
    @Req() request: Request,
  ) {
    if (!searchQuery) return [];
    return this.eventService.search(searchQuery);
  }
}
