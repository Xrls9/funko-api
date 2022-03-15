import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/set-public.decorator';
import { RolesGuard } from '../..//guards/role.guard';
import { CreateCartItemDto } from '../dtos/carts/request/create-cart-item.dto';
import { UpdateCartItemDto } from '../dtos/carts/request/update-cart-item.dto';
import { UpdateCartDto } from '../dtos/carts/request/update-cart.dto';
import { CartItemDto } from '../dtos/carts/response/cart-item.dto';
import { CartDto } from '../dtos/carts/response/cart.dto';
import { CartService } from '../services/cart.service';

@ApiTags('ShoppingCart')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a shopping cart for a user' })
  @ApiResponse({ status: 200, description: 'Funko updated Info' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, you must be registered',
  })
  @ApiResponse({
    status: 404,
    description: 'User not Found',
  })
  async createCart(@Req() req): Promise<CartDto> {
    return await this.cartService.createCart(req.user.uuid);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates an existing Cart' })
  @ApiResponse({ status: 200, description: 'Cart updated Info' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, you must be registered',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  async updateCart(
    @Param('id') cartId: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<CartDto> {
    return await this.cartService.updateCart(cartId, updateCartDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns the info of an existing cart' })
  @ApiResponse({ status: 200, description: 'Cart Info' })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  async cartInfo(@Param('id') cartId: string): Promise<CartDto> {
    return await this.cartService.findCartByUuid(cartId);
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Returns a list of CartItems' })
  @ApiResponse({ status: 200, description: 'CartItems Info' })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  async showCartDetails(@Param('id') cartId: string): Promise<CartItemDto[]> {
    return await this.cartService.getCartItems(cartId);
  }

  @Post(':id/addFunko')
  @ApiOperation({ summary: 'Add an item to the Shopping Cart' })
  @ApiResponse({ status: 200, description: 'CartItem Info' })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  async addItemToCart(
    @Param('id') cartId: string,
    @Body() createCartItemDto: CreateCartItemDto,
  ): Promise<CartItemDto> {
    return await this.cartService.addItemToCart(cartId, createCartItemDto);
  }

  @Patch(':id/updateItem')
  @ApiOperation({ summary: 'Updates an existing item of the Shopping Cart' })
  @ApiResponse({ status: 200, description: 'CartItem Info' })
  @ApiResponse({
    status: 404,
    description: 'CartItem not found',
  })
  async updateCartItem(
    @Param('id') cartItemUuid: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItemDto> {
    return await this.cartService.updateCartItem(
      cartItemUuid,
      updateCartItemDto,
    );
  }

  @Post(':id/deleteItem')
  @ApiOperation({ summary: 'Deletes an existing item of the Shopping Cart' })
  @ApiResponse({ status: 200, description: 'CartItem Info' })
  @ApiResponse({
    status: 404,
    description: 'CartItem not found',
  })
  async deleteCartItem(
    @Param('id') cartItemUuid: string,
  ): Promise<CartItemDto> {
    return await this.cartService.deleteCartItem(cartItemUuid);
  }
}
