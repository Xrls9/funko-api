import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Public } from '../../decorators/set-public.decorator';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { UserDto } from '../dtos/response/user.dto';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<boolean> {
    return await this.userService.create(userDto);
  }

  @Get(':id')
  async findOne(@Param('id') userUuid: string): Promise<UserDto> {
    return await this.userService.findOne(userUuid);
  }

  @Patch(':id')
  async update(
    @Param('id') userUuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.userService.update(userUuid, updateUserDto);
  }
}
