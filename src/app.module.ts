import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/services/auth.service';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './user/user.module';
import { UserService } from './user/services/user.service';
import { SendgridService } from './services/sengrid.service';
import { RolesGuard } from './guards/role.guard';
import { FunkoService } from './funkos/services/funko.service';
import { FunkoModule } from './funkos/funko.module';
import { CartService } from './carts/services/cart.service';
import { CartModule } from './carts/cart.module';
import { ConfigModule } from '@nestjs/config';
import { FilesService } from './services/file.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true,
      playground: true,
      sortSchema: true,
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [
    AuthService,
    UserService,
    CartService,
    SendgridService,
    RolesGuard,
    FunkoService,
    FilesService,
  ],
})
export class AppModule {}
