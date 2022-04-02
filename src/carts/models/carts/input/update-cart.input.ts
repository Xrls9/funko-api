import { InputType, PickType } from '@nestjs/graphql';
import { CreateCartInput } from './create-cart.input';

@InputType()
export class UpdateCartInput extends PickType(CreateCartInput, [
  'totalPrice',
]) {}
