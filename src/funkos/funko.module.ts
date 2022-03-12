import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtStrategy } from 'src/services/jwt.strategy';
import { SendgridService } from 'src/services/sengrid.service';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [JwtStrategy, AuthService, SendgridService],
  exports: [],
})
export class FunkoModule {}
