import { Injectable } from '@nestjs/common';
import { prisma } from '../../prisma';
import { CreateCartDto } from '../dtos/carts/request/create-cart.dto';
import { CartDto } from '../dtos/carts/response/cart.dto';

@Injectable()
export class CartService {}
