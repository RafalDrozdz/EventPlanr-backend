import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../user/user.entity';
const pug = require('pug');

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendTicket(user: User) {
    await this.mailerService.sendMail({
      to: 'rafadrozdzlodz@gmail.com',
      from: '"Support Team" <evently.api@gmail.com>',
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './ticket',
      context: {
        name: user.name,
      },
    });
  }
}
