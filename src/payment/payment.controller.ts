import { Body, Controller, Post } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  @Post('buy')
  buyTickets(@Body() lineItems: Stripe.PaymentLinkCreateParams.LineItem[]) {
    return this.paymentService.getPaymentLink(lineItems);
  }
}
