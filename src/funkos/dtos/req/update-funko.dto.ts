import { PartialType } from '@nestjs/swagger';
import { CreateFunkoDto } from './create-funko.dto';

export class UpdateFunkoDto extends PartialType(CreateFunkoDto) {}
