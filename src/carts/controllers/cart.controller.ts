import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/set-public.decorator';
import { RolesGuard } from '../..//guards/role.guard';
import { getUser } from '../../user/decorators/get-user.decorator';

import { CreateCartItemDto } from '../dtos/carts/request/create-cart-item.dto';

import { UpdateCartDto } from '../dtos/carts/request/update-cart.dto';
import { CartItemDto } from '../dtos/carts/response/cart-item.dto';
import { CartDto } from '../dtos/carts/response/cart.dto';
import { OrderResponse } from '../dtos/orders/response/order-response.dto';
import { Order } from '../dtos/orders/response/order.dto';
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
  @ApiBearerAuth()
  async createCart(@getUser() user): Promise<CartDto> {
    return await this.cartService.createCart(user.uuid);
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiResponse({
    status: 409,
    description: 'The funko funko.name is not available',
  })
  @ApiBearerAuth()
  async updateCartItem(
    @Param('id') cartItemUuid: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ): Promise<CartItemDto> {
    return await this.cartService.updateCartItem(cartItemUuid, {
      quantity: quantity,
    });
  }

  @Post(':id/deleteItem')
  @ApiOperation({ summary: 'Deletes an existing item of the Shopping Cart' })
  @ApiResponse({ status: 200, description: 'CartItem Info' })
  @ApiResponse({
    status: 404,
    description: 'CartItem not found',
  })
  @ApiBearerAuth()
  async deleteCartItem(
    @Param('id') cartItemUuid: string,
  ): Promise<CartItemDto> {
    return await this.cartService.deleteCartItem(cartItemUuid);
  }

  @Post(':id/clearCart')
  @ApiOperation({ summary: 'Clear Cart' })
  @ApiResponse({ status: 200, description: 'OrderResponse' })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  @ApiResponse({
    status: 409,
    description: 'The funko funko.name is not available',
  })
  @ApiResponse({
    status: 409,
    description: 'Cart is empty',
  })
  @ApiBearerAuth()
  async clearCart(@Param('id') cartUuid: string): Promise<CartDto> {
    return await this.cartService.clearCart(cartUuid);
  }

  @Post(':id/checkout')
  @ApiOperation({ summary: 'Proceed to Checkout' })
  @ApiResponse({ status: 200, description: 'OrderResponse' })
  @ApiResponse({
    status: 404,
    description: 'CartItem not found',
  })
  @ApiResponse({
    status: 409,
    description: 'The funko funko.name is not available',
  })
  @ApiResponse({
    status: 409,
    description: 'Cart is empty',
  })
  @ApiBearerAuth()
  async proceedToCheckout(
    @Param('id') cartUuid: string,
  ): Promise<OrderResponse> {
    return await this.cartService.checkout(cartUuid);
  }

  @Get('show-orders/:id')
  @ApiOperation({ summary: 'shows orders from a Client' })
  @ApiResponse({ status: 200, description: 'Orders' })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'User does not have any order yet',
  })
  @ApiBearerAuth()
  async showUserOrders(@Param('id') userUuid: string): Promise<Order[]> {
    return await this.cartService.showUserOrders(userUuid);
  }
}
