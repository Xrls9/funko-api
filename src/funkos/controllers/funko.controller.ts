import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../guards/role.guard';
import { Public } from '../../decorators/set-public.decorator';
import { CreateFunkoDto } from '../dtos/req/create-funko.dto';
import { FunkoDto } from '../dtos/res/funko.dto';
import { FunkoService } from '../services/funko.service';

@Controller('funkos')
export class FunkoController {
  constructor(private readonly funkoService: FunkoService) {}

  @UseGuards(new RolesGuard())
  @Post()
  async create(): Promise<void> {
    // return await this.funkoService.create(funkoDto);
    console.log('admin');
  }

  // @Get(':id')
  // async findOne(@Param('id') userUuid: string): Promise<UserDto> {
  //   return await this.funkoService.findOne(userUuid);
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id') userUuid: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<UserDto> {
  //   return await this.funkoService.update(userUuid, updateUserDto);
  // }
}
