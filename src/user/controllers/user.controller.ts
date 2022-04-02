import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../decorators/set-public.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { PasswordRecoveryDto } from '../dtos/request/password-recovery.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { UserDto } from '../dtos/response/user.dto';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Creates a new User' })
  @ApiResponse({ status: 200, description: 'User created Info' })
  async create(@Body() userDto: CreateUserDto): Promise<UserDto> {
    return await this.userService.create(userDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a User with the given UUID' })
  @ApiResponse({ status: 200, description: 'User Info' })
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') userUuid: string): Promise<UserDto> {
    return await this.userService.findOne(userUuid);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates an existing User' })
  @ApiResponse({ status: 200, description: 'User Info' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') userUuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.userService.update(userUuid, updateUserDto);
  }

  @Patch(':id/forgot-password')
  @ApiOperation({ summary: 'Changes password to an existing User' })
  @ApiResponse({ status: 200, description: 'User Info' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Param('id') userUuid: string,
    @Body() updateUserDto: PasswordRecoveryDto,
  ): Promise<UserDto> {
    return await this.userService.changePassword(userUuid, updateUserDto);
  }
}
