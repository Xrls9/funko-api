import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './services/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(PrismaService);
  await app.listen(3000);
}
bootstrap();
