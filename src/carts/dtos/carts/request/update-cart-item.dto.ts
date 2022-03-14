import { PickType } from '@nestjs/swagger';
import { CreateCartItemDto } from './create-cart-item.dto';

// update user body
export class UpdateCartItemDto extends PickType(CreateCartItemDto, [
  'quantity',
]) {}
