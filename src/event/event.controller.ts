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
  async get(@Param('id') id: number, @Req() request: Request) {
    const event = await this.eventService.findOne({ where: { id } });

    return { ...event };
  }
}
