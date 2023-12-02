import Stripe from 'stripe';

export class BuyTicketDto {
  tickets: Stripe.PaymentLinkCreateParams.LineItem[];
}
