import { OmitType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { CartItemDto } from '../../carts/response/cart-item.dto';

// get users response
@Exclude()
export class OrderItem extends OmitType(CartItemDto, ['cartId'] as const) {
  @Expose()
  orderId: string;
}
