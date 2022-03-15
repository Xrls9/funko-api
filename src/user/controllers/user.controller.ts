import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../decorators/set-public.decorator';
import { CreateUserDto } from '../dtos/request/create-user.dto';
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
  async create(@Body() userDto: CreateUserDto): Promise<boolean> {
    return await this.userService.create(userDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a User with the given UUID' })
  @ApiResponse({ status: 200, description: 'User Info' })
  async findOne(@Param('id') userUuid: string): Promise<UserDto> {
    return await this.userService.findOne(userUuid);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates an existing User' })
  @ApiResponse({ status: 200, description: 'User Info' })
  async update(
    @Param('id') userUuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.userService.update(userUuid, updateUserDto);
  }
}
