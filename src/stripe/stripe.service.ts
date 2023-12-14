import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Event } from '../event/event.entity';
import { User } from '../user/user.entity';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class StripeService {
  createProduct(ticket: any, event: Event) {
    return stripe.products.create({
      name: `${event.title} ${ticket.title}`,
      default_price_data: {
        currency: ticket.currency.toLowerCase(),
        unit_amount: ticket.price * 100,
      },
      metadata: { ...ticket, event_id: event.id },
    });
  }

  async getTickets(event_id: number) {
    const tickets = await stripe.products.search({
      query: `metadata['event_id']:"${event_id}"`,
    });

    return tickets.data;
  }

  async getPaymentLink(
    line_items: Stripe.PaymentLinkCreateParams.LineItem[],
    user: User,
  ) {
    const response = await stripe.paymentLinks.create({
      line_items,
      metadata: user as unknown as Stripe.MetadataParam,
    });

    return response.url;
  }

  async getUser(id: string) {
    const paymentLink = await stripe.paymentLinks.retrieve(id);
    return paymentLink.metadata;
  }

  async handlePayment(event: Stripe.Event) {
    if (
      event.type === 'checkout.session.completed' &&
      event.data.object.payment_status === 'paid'
    ) {
      const paymentLink = await stripe.paymentLinks.retrieve(
        event.data.object.payment_link as string,
      );
      const user = paymentLink.metadata;

      console.log(user);
      console.log(event);
    }
  }
}