import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../user/user.entity';
import Stripe from 'stripe';
import { Event } from '../event/event.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendTicket(user: User, lineItems: Stripe.LineItem[], event: Event) {
    await this.mailerService.sendMail({
      to: 'rafadrozdzlodz@gmail.com',
      from: '"Evently" <evently.api@gmail.com>',
      subject: `Evently - Twój bilet! ${event.title}`,
      template: './ticket',
      context: {
        name: user.name,
        amount: lineItems.length,
        title: event.title,
        date: event.start_date,
        localization: event.place_name,
      },
    });
  }
}
