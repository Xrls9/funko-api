import { Module } from '@nestjs/common';
import { RolesGuard } from '../guards/role.guard';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { JwtStrategy } from '../services/jwt.strategy';
import { CartService } from './services/cart.service';
import { CartController } from './controllers/cart.controller';

@Module({
  imports: [AuthModule],
  controllers: [CartController],
  providers: [JwtStrategy, AuthService, CartService, RolesGuard],
  exports: [],
})
export class CartModule {}
