import { Module } from '@nestjs/common';
import { RolesGuard } from '../guards/role.guard';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { JwtStrategy } from '../services/jwt.strategy';
import { SendgridService } from '../services/sengrid.service';
import { FunkoController } from './controllers/funko.controller';
import { FunkoService } from './services/funko.service';
import { FilesService } from '../services/file.service';
import { FunkoResolver } from './resolvers/funko.resolver';

@Module({
  imports: [AuthModule],
  controllers: [FunkoController],
  providers: [
    JwtStrategy,
    AuthService,
    SendgridService,
    FunkoService,
    RolesGuard,
    FilesService,
    FunkoResolver,
  ],
  exports: [FunkoModule, FunkoService],
})
export class FunkoModule {}
