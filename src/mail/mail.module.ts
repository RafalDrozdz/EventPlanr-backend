import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';
import { configService, ConfigService } from '../config/config.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        // transport: configService.getEmailTransport(),
        // or
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          auth: configService.getEmail(),
          port: 587,
        },
        defaults: {
          from: '"No Reply" <evently.api@gmail.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
