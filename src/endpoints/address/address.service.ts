import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressEntity } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {

  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  // Método para crear una nueva dirección
  async create(createAddressDto: CreateAddressDto): Promise<AddressEntity> {
    const address = this.addressRepository.create(createAddressDto); // Crea una nueva entidad Address
    return await this.addressRepository.save(address); // Guarda la entidad en la base de datos
  }

  // Método para obtener todas las direcciones
  async findAll(): Promise<AddressEntity[]> {
    return await this.addressRepository.find(); // Devuelve todas las direcciones
  }

  // Método para obtener una dirección por su id
  async findOne(id: string): Promise<AddressEntity> {
    const address = await this.addressRepository.findOne({ where: { id} }); // Busca la dirección por id
    if (!address) {
      throw new Error('Address not found'); // Lanza un error si no se encuentra
    }
    return address;
  }

  // Método para actualizar una dirección
  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<AddressEntity> {
    const address = await this.addressRepository.findOne({ where: { id} }); // Busca la dirección por id
    if (!address) {
      throw new Error('Address not found'); // Lanza un error si no se encuentra
    }
    // Actualiza los campos de la dirección
    Object.assign(address, updateAddressDto);
    return await this.addressRepository.save(address); // Guarda la dirección actualizada
  }

  // Método para eliminar una dirección
  async remove(id: string): Promise<void> {
    const address = await this.addressRepository.findOne({ where: { id} }); // Busca la dirección por id
    if (!address) {
      throw new Error('Address not found'); // Lanza un error si no se encuentra
    }
    await this.addressRepository.remove(address); // Elimina la dirección de la base de datos
  }
}
