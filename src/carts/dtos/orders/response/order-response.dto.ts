import { Expose } from 'class-transformer';
import { OrderItem } from './order-item.dto';
import { Order } from './order.dto';

export class OrderResponse {
  @Expose()
  readonly orderInfo: Order;

  @Expose()
  readonly count: number;

  @Expose()
  readonly orderDetails: OrderItem[];
}
