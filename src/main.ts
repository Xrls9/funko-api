import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //  only accept dto formatted data
      forbidNonWhitelisted: true, // throws error when there is data that is not in dto
      transform: true, // transform to dto format
      transformOptions: {
        enableImplicitConversion: true,
      },
      validationError: { target: false, value: false },
    }),
  );

  app.setGlobalPrefix('api/v1');

  const options = new DocumentBuilder()
    .setTitle('funko-app')
    .setDescription('Your favorite funko store')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
