import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { JwtStrategy } from '../services/jwt.strategy';
import { SendgridService } from '../services/sengrid.service';
import { FunkoController } from './controllers/funko.controller';
import { FunkoService } from './services/funko.service';

@Module({
  imports: [AuthModule],
  controllers: [FunkoController],
  providers: [JwtStrategy, AuthService, SendgridService, FunkoService],
  exports: [],
})
export class FunkoModule {}