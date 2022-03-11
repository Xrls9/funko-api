import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtStrategy } from 'src/services/jwt.strategy';
import { SendgridService } from 'src/services/sengrid.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [JwtStrategy, AuthService, SendgridService],
  exports: [UserService],
})
export class UserModule {}
