import { PickType } from '@nestjs/swagger';
import { CreateFunkoReactionDto } from './create-funko-reaction.dto';

export class UpdateFunkoReactionDto extends PickType(CreateFunkoReactionDto, [
  'reaction',
  'userId',
]) {}
