import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from './entities/client.entity';
import { AddressEntity } from '../address/entities/address.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,

    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<ClientEntity> {    
    const client = this.clientRepository.create(createClientDto);
    const savedClient = await this.clientRepository.save(client);

    const addresses = createClientDto.addresses.map(addressDto => {
      const address = this.addressRepository.create({
        ...addressDto,
        client: savedClient,
      });
      return address;
    });
    
    await this.addressRepository.save(addresses);

    savedClient.addresses = addresses;
    
    return await this.findOne(savedClient.id);
  }

  async findAll(): Promise<ClientEntity[]> {
    return await this.clientRepository.find({ relations: ['addresses'] });
  }

  async findOne(id: string): Promise<ClientEntity> {
    const client = await this.clientRepository.findOne({ where: { id }, relations: ['addresses'] });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<ClientEntity> {
    const client = await this.clientRepository.preload({
      id,
      ...updateClientDto,
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return await this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  }
}
