import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/services/auth.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { UserService } from './user/services/user.service';
import { SendgridService } from './services/sengrid.service';
import { RolesGuard } from './guards/role.guard';
import { FunkoService } from './funkos/services/funko.service';
import { FunkoModule } from './funkos/funko.module';
import { CartService } from './carts/services/cart.service';
import { CartModule } from './carts/cart.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    FunkoModule,
    CartModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    AuthService,
    UserService,
    CartService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    SendgridService,
    RolesGuard,
    FunkoService,
  ],
})
export class AppModule {}
