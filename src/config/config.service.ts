import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtModuleOptions } from '@nestjs/jwt';
import { Event } from '../event/event.entity';
import { TypeOfTicket } from '../type-of-ticket/type-of-ticket.entity';
import { Ticket } from '../ticket/ticket.entity';

require('dotenv').config();

export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public getEmail() {
    return {
      user: this.getValue('EMAIL_LOGIN', true),
      pass: this.getValue('EMAIL_PASSWORD', true),
    };
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: [User, Event, Ticket, TypeOfTicket],
      // Ticket, TypeOfTicket
      synchronize: true,
    };
  }

  public getJwtOptions(): JwtModuleOptions {
    return {
      secret: this.getValue('SECRET_KEY'),
      signOptions: {
        expiresIn: this.getValue('TOKEN_EXPIRES_IN'),
      },
    };
  }

  public getCorsOptions() {
    return {
      origin: this.getValue('CORS_ORIGIN'),
      credentials: true,
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
]);

export { configService };
