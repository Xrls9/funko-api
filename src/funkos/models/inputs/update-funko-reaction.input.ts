import { PickType } from '@nestjs/graphql';
import { CreateFunkoReactionInput } from './create-funko-reaction.input';

export class UpdateFunkoReactionInput extends PickType(
  CreateFunkoReactionInput,
  ['reaction', 'userId'],
) {}
