import { PickType } from '@nestjs/graphql';
import { CreateOrderInput } from './create-order.input';

export class UpdateOrderInput extends PickType(CreateOrderInput, [
  'totalPrice',
]) {}
