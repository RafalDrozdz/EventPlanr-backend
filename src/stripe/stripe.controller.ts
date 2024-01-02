import { Body, Controller, Post, Req } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { MailService } from '../mail/mail.service';
import { EventService } from '../event/event.service';

@Controller('payments')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private jwtService: JwtService,
    private mailService: MailService,
    private eventService: EventService,
  ) {}
  @Post('buy')
  async buyTickets(
    @Body()
    body: {
      event_id: number;
      line_items: Stripe.PaymentLinkCreateParams.LineItem[];
    },
    @Req() request: Request,
  ) {
    const cookieAccessToken = request.cookies['accessToken'];
    const user = await this.jwtService.verifyAsync(cookieAccessToken);

    return this.stripeService.getPaymentLink(
      body.line_items,
      user,
      body.event_id,
    );
  }

  @Post('/webhook')
  async watchEvents(@Req() request: Request) {
    const paymentEvent: Stripe.Event = request.body;
    const { user, lineItems, event_id } =
      await this.stripeService.handlePayment(paymentEvent);
    const event = await this.eventService.findOne({ where: { id: event_id } });
    await this.mailService.sendTicket(user, lineItems, event);
  }
}
