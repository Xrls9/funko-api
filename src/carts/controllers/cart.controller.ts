import { Controller, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../..//guards/role.guard';
import { CartService } from '../services/cart.service';

@Controller('shopping-cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(new RolesGuard())
  @Post()
  async create(): Promise<void> {
    // return await this.funkoService.create(funkoDto);
    console.log('admin');
  }
}
