import { PickType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

// update user body
export class UpdateCartDto extends PickType(CreateOrderDto, ['totalPrice']) {}
