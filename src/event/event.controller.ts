import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { EventService } from './event.service';
import { TypeOfTicketService } from '../type-of-ticket/type-of-ticket.service';

@Controller('event')
export class EventController {
  constructor(
    private eventService: EventService,
    private typeOfTicket: TypeOfTicketService,
    private jwtService: JwtService,
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

    const promises = createEventDto.tickets.map((typeOfTicket) =>
      this.typeOfTicket.create({ ...typeOfTicket, event_id: event.id }),
    );

    const tickets = await Promise.all(promises);

    return { ...event, tickets };
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() request: Request) {
    const cookieAccessToken = request.cookies['accessToken'];
    const user = await this.jwtService.verifyAsync(cookieAccessToken);

    const event = await this.eventService.findOne({ where: { id } });
    const isOwner = user?.id === event.creator_user_id;
    const tickets = await this.typeOfTicket.find({
      where: { event_id: id },
    });

    const cheapest_ticket =
      (tickets.length &&
        tickets.reduce((prev, curr) =>
          (prev.price ?? 0) < (curr.price ?? 0) ? prev : curr,
        )) ||
      null;

    return { ...event, is_owner: isOwner, tickets, cheapest_ticket };
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
