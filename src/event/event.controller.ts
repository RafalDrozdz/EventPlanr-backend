import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { EventService } from './event.service';
import { StripeService } from '../stripe/stripe.service';

@Controller('event')
export class EventController {
  constructor(
    private eventService: EventService,
    private jwtService: JwtService,
    private stripeService: StripeService,
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

    const ticketPromises = createEventDto.tickets.map((ticket) =>
      this.stripeService.createProduct(ticket, event),
    );

    const tickets = await Promise.all(ticketPromises);

    return { ...event, tickets };
  }

  @Get(':id')
  async get(@Param('id') id: number, @Req() request: Request) {
    const cookieAccessToken = request.cookies['accessToken'];
    const user = await this.jwtService.verifyAsync(cookieAccessToken);

    const event = await this.eventService.findOne({ where: { id } });
    const is_owner = user?.id === event.creator_user_id;
    const tickets = await this.stripeService.getTickets(id);

    return { ...event, is_owner, tickets };
  }

  @Get()
  async getAll(@Req() request: Request) {
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
