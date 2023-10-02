import { Controller, Request, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { RequestTokenDto } from './dto/RequestTokenDTO';
import * as crypto from 'crypto';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    ) {}

  @Post('login')
  async requestToken(@Body() requestTokenDto: RequestTokenDto): Promise<any> {
    // console.log(crypto.createHmac('sha256',requestTokenDto.mot_de_passe).digest('hex'));
    const user = await this.userService.findByCredentials(
      requestTokenDto.email,
      requestTokenDto.mot_de_passe,
    );

    if (!user) {
      throw new NotFoundException(
        'No user found with the email or password provided.',
      );
    }

    return await this.authService.createToken(user.email);
  }


}
