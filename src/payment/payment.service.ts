import { Injectable } from '@nestjs/common';
import { TypeOfTicket } from '../type-of-ticket/type-of-ticket.entity';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class PaymentService {
  createProduct(ticket: TypeOfTicket, eventTitle: string) {
    return stripe.products.create({
      id: ticket.id.toString(),
      name: ticket.title,
      default_price_data: {
        currency: ticket.currency.toLowerCase(),
        unit_amount: ticket.price * 100,
      },
    });
  }

  async getPaymentLink(line_items: Stripe.PaymentLinkCreateParams.LineItem[]) {
    const response = await stripe.paymentLinks.create({
      line_items,
    });

    return response.url;
  }
}
