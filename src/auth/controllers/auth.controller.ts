import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Public } from '../../decorators/set-public.decorator';
import { LoginDto } from '../dtos/request/login.dto';
import { TokenDto } from '../dtos/response/token.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return await this.authService.login(loginDto);
  }

  @Public()
  @Get('logout')
  async logout(@Request() req) {
    return await this.authService.logout(
      req.headers.authorization.replace('Bearer ', ''),
    );
  }
}
