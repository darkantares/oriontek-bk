import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressEntity } from './entities/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
    imports: [
      TypeOrmModule.forFeature([AddressEntity]),
    ]
})
export class AddressModule {}
