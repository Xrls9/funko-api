import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { JwtStrategy } from '../services/jwt.strategy';
import { SendgridService } from '../services/sengrid.service';
import { UserController } from './controllers/user.controller';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    JwtStrategy,
    AuthService,
    SendgridService,
    UserService,
    UserResolver,
  ],
  exports: [],
})
export class UserModule {}
