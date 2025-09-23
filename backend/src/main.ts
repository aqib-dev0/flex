import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Enable CORS
  app.enableCors();
  
  // Set up flexible port configuration
  const port = process.env.PORT || 3001;
  
  // Start the server
  try {
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error: any) {
    // If the port is already in use, try another port
    if (error?.code === 'EADDRINUSE') {
      const fallbackPort = parseInt(port.toString()) + 1000;
      console.log(`Port ${port} is already in use, trying port ${fallbackPort} instead...`);
      await app.listen(fallbackPort);
      console.log(`Application is running on: ${await app.getUrl()}`);
    } else {
      throw error;
    }
  }
}

bootstrap();
