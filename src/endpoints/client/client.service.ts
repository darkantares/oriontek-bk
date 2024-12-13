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
    const transaction = await this.clientRepository.manager.transaction(async clientEntityManager => {
      const client = this.clientRepository.create(createClientDto);
      const savedClient = await clientEntityManager.save(client);
  
      if (createClientDto.addresses.length !== 0) {
        const addresses = createClientDto.addresses.map(addressDto => {
          const address = this.addressRepository.create({
            ...addressDto,
            client: savedClient,
          });
          return address;
        });
        
        await clientEntityManager.save(AddressEntity, addresses);
    
        savedClient.addresses = addresses;      
      }
  
      return clientEntityManager.findOne(ClientEntity, { where: { id: savedClient.id }, relations: ['addresses'] });
    })

    return transaction
  }

  async findAll(): Promise<ClientEntity[]> {
    return await this.clientRepository
    .createQueryBuilder('client')
    .leftJoinAndSelect('client.addresses', 'address')
    .where('client.is_active = :is_active', { is_active: true })
    .getMany();
  }

  async findOne(id: string): Promise<ClientEntity> {
    const client = await this.clientRepository.findOne({ where: { id }, relations: ['addresses'] });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<ClientEntity> {
    console.log('updating');
    
    // Cargar cliente con direcciones asociadas
    const client = await this.clientRepository.preload({
      id,
      ...updateClientDto,
    });
  
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  
    // Si hay direcciones para actualizar
    if (updateClientDto.addresses && updateClientDto.addresses.length > 0) {
      // Eliminar las direcciones existentes
      await this.addressRepository.delete({ client: { id } });
  
      // Crear nuevas direcciones asociadas con el cliente
      const updatedAddresses = updateClientDto.addresses.map(addressDto => {
        const address = this.addressRepository.create({
          ...addressDto,
          client,
        });
        return address;
      });
  
      await this.addressRepository.save(updatedAddresses);
      client.addresses = updatedAddresses;
    }
  
    // Guardar cliente actualizado
    return await this.clientRepository.save(client);
  }
  

  async remove(id: string): Promise<void> {
    const result = await this.clientRepository.update(id, { is_active: false });
  
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  }
  
}
