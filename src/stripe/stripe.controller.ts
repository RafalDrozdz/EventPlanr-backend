import { Body, Controller, Post, Req } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('payments')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private jwtService: JwtService,
  ) {}
  @Post('buy')
  async buyTickets(
    @Body() lineItems: Stripe.PaymentLinkCreateParams.LineItem[],
    @Req() request: Request,
  ) {
    const cookieAccessToken = request.cookies['accessToken'];
    const user = await this.jwtService.verifyAsync(cookieAccessToken);

    return this.stripeService.getPaymentLink(lineItems, user);
  }
}
