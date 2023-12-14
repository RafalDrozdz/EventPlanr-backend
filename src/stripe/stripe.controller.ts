import { Body, Controller, Post, Req } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { MailService } from '../mail/mail.service';
import { User } from '../user/user.entity';

@Controller('payments')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
  @Post('buy')
  async buyTickets(
    @Body() lineItems: Stripe.PaymentLinkCreateParams.LineItem[],
    @Req() request: Request,
  ) {
    const cookieAccessToken = request.cookies['accessToken'];
    const user = await this.jwtService.verifyAsync(cookieAccessToken);

    await this.mailService.sendTicket(user);

    return this.stripeService.getPaymentLink(lineItems, user);
  }

  @Post('/webhook')
  async watchEvents(@Req() request: Request) {
    const event: Stripe.Event = request.body;
    if (
      event.type === 'checkout.session.completed' &&
      event.data.object.payment_status === 'paid'
    ) {
      const user = (await this.stripeService.getUser(
        event.data.object.payment_link as string,
      )) as unknown as User;

      await this.mailService.sendTicket(user);
      console.log(user);
      console.log(event);
    }
  }
}