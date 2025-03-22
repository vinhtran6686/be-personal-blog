import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters/http-exception.filter';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable CORS with more secure options
  app.enableCors({
    origin: ['http://localhost:3000'], // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  // Use Helmet for security headers
  app.use(helmet());
  
  // Add rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later'
    }),
  );
  
  // Parse cookies
  app.use(cookieParser());
  
  // Set global prefix from config
  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api/v1';
  app.setGlobalPrefix(apiPrefix);
  
  // Use validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Apply global exception filters
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter(),
  );
  
  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Personal Blog API')
    .setDescription('API for the personal blog application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Get port from config
  const port = configService.get<number>('app.port') ?? 3001;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap();
