import { InputType, PartialType } from '@nestjs/graphql';
import { CreateFunkoInput } from './create-funko.input';

@InputType()
export class UpdateFunkoInput extends PartialType(CreateFunkoInput) {}
