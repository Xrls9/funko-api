import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../../guards/role.guard';
import { Public } from '../../decorators/set-public.decorator';
import { CreateFunkoDto } from '../dtos/req/create-funko.dto';
import { FunkoDto } from '../dtos/res/funko.dto';
import { FunkoService } from '../services/funko.service';
import { UpdateFunkoDto } from '../dtos/req/update-funko.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '@prisma/client';
import { getUser } from '../../user/decorators/get-user.decorator';
import { PaginationDto } from '../dtos/res/pagination.dto';
import { Roles } from '../../decorators/role.decorator';
import { UserRole } from '../../utils/enums';

@ApiTags('Funkos')
@Controller('funkos')
export class FunkoController {
  constructor(private readonly funkoService: FunkoService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.manager)
  @Post()
  @ApiOperation({ summary: 'Creates a new Funko' })
  @ApiResponse({ status: 200, description: 'Funko created Info' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, you must be a manager role User',
  })
  @ApiBearerAuth()
  async create(
    @getUser() user: User,
    @Body() createFunkoDto: CreateFunkoDto,
  ): Promise<FunkoDto> {
    return await this.funkoService.create(user.uuid, createFunkoDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Gets a list of Funkos by category and paginated' })
  @ApiResponse({ status: 200, description: 'Returns a list of active funkos' })
  async findMany(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageItems', new DefaultValuePipe(10), ParseIntPipe)
    pageItems: number,
    @Query('category', new DefaultValuePipe('')) category: string,
  ): Promise<PaginationDto> {
    return await this.funkoService.find(page, pageItems, category);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.manager)
  @ApiOperation({ summary: 'Updates an existing Funko' })
  @ApiResponse({ status: 200, description: 'Funko updated Info' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, you must be a manager role User',
  })
  @ApiResponse({
    status: 404,
    description: 'Funko not found',
  })
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') funkoUuid: string,
    @Body() updateUserDto: UpdateFunkoDto,
  ): Promise<FunkoDto> {
    return await this.funkoService.update(funkoUuid, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.manager)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes an existing Funko' })
  @ApiResponse({ status: 200, description: 'Funko deleted Info' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, you must be a manager role User',
  })
  @ApiResponse({
    status: 404,
    description: 'Funko not found',
  })
  @ApiBearerAuth()
  async deleteFunko(@Param('id') funkoUuid: string): Promise<FunkoDto> {
    return await this.funkoService.remove(funkoUuid);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Shows a funko information' })
  @ApiResponse({ status: 200, description: 'Funko Info' })
  @ApiResponse({
    status: 404,
    description: 'Funko not found',
  })
  async showFunko(@Param('id') funkoUuid: string): Promise<FunkoDto> {
    return await this.funkoService.findOne(funkoUuid);
  }
}
