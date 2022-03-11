import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/services/jwt.strategy';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
