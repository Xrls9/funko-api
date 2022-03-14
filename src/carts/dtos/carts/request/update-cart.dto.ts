import { PickType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';

// update user body
export class UpdateCartDto extends PickType(CreateCartDto, ['totalPrice']) {}
