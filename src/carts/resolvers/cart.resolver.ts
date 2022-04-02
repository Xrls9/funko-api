import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { getUser } from '../../user/decorators/get-user.decorator';
import { CartItemModel } from '../models/carts/cart-item.model';
import { CartModel } from '../models/carts/cart.model';
import { CreateCartItemInput } from '../models/carts/input/create-cart-item.input';
import { UpdateCartItemInput } from '../models/carts/input/update-cart-item.input';
import { UpdateCartInput } from '../models/carts/input/update-cart.input';
import { CartService } from '../services/cart.service';
import { OrderResponseModel } from '../models/orders/order-response.model';
import { OrderModel } from '../models/orders/order.model';
import { Public } from '../../decorators/set-public.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlJwtGuard } from '../../guards/gql-jwt-auth.guard';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(GqlJwtGuard)
  @Mutation(() => CartModel, {
    description: 'Creates a shopping cart for a user',
  })
  async createCart(@getUser() user): Promise<CartModel> {
    return await this.cartService.createCart(user.uuid);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => CartModel, { description: 'Updates an existing Cart' })
  async updateCart(
    @Args('cartUuid') cartUuid: string,
    @Args('input') updateCartDto: UpdateCartInput,
  ): Promise<CartModel> {
    return await this.cartService.updateCart(cartUuid, updateCartDto);
  }

  @UseGuards(GqlJwtGuard)
  @Query(() => CartModel, {
    description: 'Returns the info of an existing cart',
  })
  async cartInfo(@Args('cartUuid') cartUuid: string): Promise<CartModel> {
    return await this.cartService.findCartByUuid(cartUuid);
  }

  @UseGuards(GqlJwtGuard)
  @Query(() => [CartItemModel], {
    description: 'Returns a list of Items that belong to a cart',
  })
  async showCartDetails(
    @Args('cartUuid') cartUuid: string,
  ): Promise<CartItemModel[]> {
    return await this.cartService.getCartItems(cartUuid);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => CartItemModel, {
    description: 'Add an item to the Shopping Cart',
  })
  async addItemToCart(
    @Args('cartUuid') cartUuid: string,
    @Args('input') createCartItemInput: CreateCartItemInput,
  ): Promise<CartItemModel> {
    return await this.cartService.addItemToCart(cartUuid, createCartItemInput);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => CartItemModel, {
    description: 'Updates an existing item of the Shopping Cart',
  })
  async updateCartItem(
    @Args('cartItemUuid') cartItemUuid: string,
    @Args('quantity') updateCartItemInput: UpdateCartItemInput,
  ): Promise<CartItemModel> {
    return await this.cartService.updateCartItem(
      cartItemUuid,
      updateCartItemInput,
    );
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => CartItemModel, {
    description: 'Deletes an existing item of the Shopping Cart',
  })
  async deleteCartItem(
    @Args('cartItemUuid') cartItemUuid: string,
  ): Promise<CartItemModel> {
    return await this.cartService.deleteCartItem(cartItemUuid);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => CartModel, { description: 'Clear Cart' })
  async clearCart(@Args('cartUuid') cartUuid: string): Promise<CartModel> {
    return await this.cartService.clearCart(cartUuid);
  }

  @Mutation(() => OrderResponseModel, {
    description: 'Proceed to Checkout returns a response containing order data',
  })
  async proceedToCheckout(
    @Args('cartUuid') cartUuid: string,
  ): Promise<OrderResponseModel> {
    return await this.cartService.checkout(cartUuid);
  }

  @UseGuards(GqlJwtGuard)
  @Query(() => [OrderModel], { description: 'shows orders from a Client' })
  async showUserOrders(
    @Args('userUuid') userUuid: string,
  ): Promise<OrderModel[]> {
    return await this.cartService.showUserOrders(userUuid);
  }
}
