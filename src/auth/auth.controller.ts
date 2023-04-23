import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { hash, compare } from 'bcrypt';
import { omit } from 'lodash';
import { LoginMessages } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { Response, Request } from 'express';
import { Get } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role?: string,
  ) {
    const hashedPassword = await hash(password, 12);

    const user = await this.authService.create({
      name,
      surname,
      email,
      password: hashedPassword,
      role,
    });

    return omit(user, 'password');
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.findOne({ where: { email } });
    const { INVALID_CREDENTIALS } = LoginMessages;

    if (!user) {
      throw new BadRequestException(INVALID_CREDENTIALS);
    }

    const arePasswordEqual = await compare(password, user.password);

    if (!arePasswordEqual) {
      throw new BadRequestException(INVALID_CREDENTIALS);
    }

    const userData: Omit<User, 'password'> = omit(user, 'password');

    const jwt: string = await this.jwtService.signAsync(userData);

    response.cookie('accessToken', jwt, { httpOnly: true });
    response.statusCode = 200;

    return userData;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken');

    return {
      status: 'success',
    };
  }

  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookieAccessToken = request.cookies['accessToken'];

      const user = await this.jwtService.verifyAsync(cookieAccessToken);

      if (!user) {
        throw new UnauthorizedException();
      }

      return omit(user, ['iat', 'exp']);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
