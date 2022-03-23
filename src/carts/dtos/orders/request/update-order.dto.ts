import { PickType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

// update user body
export class UpdateOrderDto extends PickType(CreateOrderDto, ['totalPrice']) {}
