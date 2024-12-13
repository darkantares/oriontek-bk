import { Module } from '@nestjs/common';
import { AddressModule } from './endpoints/address/address.module';
import { ClientModule } from './endpoints/client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ClientModule,
    AddressModule, 
  ]
})
export class AppModule {}
