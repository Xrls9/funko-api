import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// update user body
export class UpdateUserDto extends PartialType(CreateUserDto) {}
