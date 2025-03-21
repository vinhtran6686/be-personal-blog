import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  // Server Configuration
  port: parseInt(process.env.PORT ?? '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB Configuration
  database: {
    uri: process.env.MONGODB_URI,
  },
  
  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || '1h',
  },
  
  // API Configuration
  apiPrefix: process.env.API_PREFIX || 'api/v1',
})); 