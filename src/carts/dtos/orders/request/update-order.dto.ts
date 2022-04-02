import { PickType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PickType(CreateOrderDto, ['totalPrice']) {}
