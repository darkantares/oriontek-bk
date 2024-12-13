import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);

  app.enableCors({
    origin: ["http://localhost:3000"],    
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  });

}
bootstrap();