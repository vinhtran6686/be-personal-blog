import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: async () => {
          return await redisStore({
            socket: {
              host: configService.get<string>('app.redis.host'),
              port: configService.get<number>('app.redis.port'),
            },
          });
        },
        ttl: 60 * 60, // 1 hour default TTL
      }),
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {} 