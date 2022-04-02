import { Module } from '@nestjs/common';
import { RolesGuard } from '../guards/role.guard';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { JwtStrategy } from '../services/jwt.strategy';
import { CartService } from './services/cart.service';
import { CartController } from './controllers/cart.controller';
import { FunkoModule } from '../funkos/funko.module';
import { CartResolver } from './resolvers/cart.resolver';
import { OrderUpdatedListener } from './events/order-listener.event';
import { SendgridService } from '../services/sengrid.service';

@Module({
  imports: [AuthModule, FunkoModule],
  controllers: [CartController],
  providers: [
    JwtStrategy,
    AuthService,
    CartService,
    RolesGuard,
    CartResolver,
    OrderUpdatedListener,
    SendgridService,
  ],
  exports: [],
})
export class CartModule {}
