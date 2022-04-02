import { InputType, PickType } from '@nestjs/graphql';
import { CreateCartItemInput } from './create-cart-item.input';

@InputType()
export class UpdateCartItemInput extends PickType(CreateCartItemInput, [
  'quantity',
]) {}
