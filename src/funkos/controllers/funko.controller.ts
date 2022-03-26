import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { Reactions, UserRole } from '../../utils/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from '../../user/dtos/response/user.dto';
import { CreateFunkoReactionDto } from '../dtos/req/create-funko-reaction.dto';
import { plainToInstance } from 'class-transformer';
import { FunkoReactionDto } from '../dtos/res/funko-reaction.dto';
import { UpdateFunkoReactionDto } from '../dtos/req/update-funko-reaction.dto';

@ApiTags('Funkos')
@Controller('funkos')
export class FunkoController {
  constructor(private readonly funkoService: FunkoService) {}

  @Roles(UserRole.manager)
  @Post()
  @ApiOperation({ summary: 'Creates a new Funko' })
  @ApiResponse({ status: 200, description: 'Funko created Info' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, you must be a manager role User',
  })
  @UseGuards(RolesGuard)
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

  @Patch(':id')
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
  async update(
    @Param('id') funkoUuid: string,
    @Body() updateUserDto: UpdateFunkoDto,
  ): Promise<FunkoDto> {
    return await this.funkoService.update(funkoUuid, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.manager)
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

  @Post(':id/upload-file')
  @UseGuards(RolesGuard)
  @Roles(UserRole.manager)
  @ApiOperation({ summary: 'Generates url to file upload' })
  @ApiResponse({ status: 200, description: 'Signed Url' })
  @ApiResponse({
    status: 404,
    description: 'Funko not found',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') funkoUuid: string,
    @UploadedFile() file,
  ): Promise<string> {
    return await this.funkoService.uploadFile(funkoUuid, file.mimetype);
  }

  @Get(':id/file')
  async getFile(@Param('id') funkoUuid: string): Promise<string> {
    const funko = await this.funkoService.findOne(funkoUuid);
    return await this.funkoService.getFile(funko.image);
  }

  @Post(':id/reaction-:reaction')
  @ApiOperation({ summary: 'Sets a reaction to a funko made by an user' })
  @ApiResponse({ status: 200, description: 'reaction created info' })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Reaction has been setted up ',
  })
  async setReaction(
    @Param('id') funkoUuid: string,
    @Param('reaction', new ParseEnumPipe(Reactions)) reaction: Reactions,
    @getUser() user: UserDto,
  ): Promise<FunkoReactionDto> {
    const reactionDto = plainToInstance(CreateFunkoReactionDto, {
      userId: user.uuid,
      funkoId: funkoUuid,
      reaction: reaction,
    });

    return await this.funkoService.setReaction(reactionDto);
  }

  @Patch(':id/update-reaction-:reaction')
  @ApiOperation({ summary: 'Updates a reaction to a funko made by an user' })
  @ApiResponse({ status: 200, description: 'reaction updated info' })
  @ApiResponse({
    status: 404,
    description: 'NotFound: No funko reaction found ',
  })
  async updateReaction(
    @Param('id') funkoUuid: string,
    @Param('reaction', new ParseEnumPipe(Reactions))
    reaction: Reactions,
    @getUser() user: UserDto,
  ): Promise<FunkoReactionDto> {
    const reactionDto = plainToInstance(UpdateFunkoReactionDto, {
      userId: user.uuid,
      reaction: reaction,
    });
    return await this.funkoService.updateReaction(funkoUuid, reactionDto);
  }

  @Get(':id/my-reaction')
  @ApiOperation({ summary: 'Shows a reaction to a funko made by an user' })
  @ApiResponse({ status: 200, description: 'reaction info' })
  @ApiResponse({
    status: 404,
    description: 'NotFound: No funko reaction found ',
  })
  async showReaction(
    @Param('id') funkoUuid: string,
    @getUser() user: UserDto,
  ): Promise<FunkoReactionDto> {
    return await this.funkoService.showReaction(funkoUuid, user.uuid);
  }
}
