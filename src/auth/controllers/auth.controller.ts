import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../decorators/set-public.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LoginDto } from '../dtos/request/login.dto';
import { TokenDto } from '../dtos/response/token.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login into your account' })
  @ApiResponse({ status: 200, description: 'Succesfully logged in' })
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return await this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Log out from your account' })
  @ApiResponse({ status: 200, description: 'Succesfully logged out' })
  async logout(@Request() req) {
    return await this.authService.logout(
      req.headers.authorization.replace('Bearer ', ''),
    );
  }
}
