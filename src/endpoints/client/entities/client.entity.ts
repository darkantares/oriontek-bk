import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsDate } from "class-validator";
import { AddressEntity } from "src/endpoints/address/entities/address.entity";
import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";

@Entity({ name: 'clients' })
export class ClientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @Column()
  firstName: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @Column()
  lastName: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @Column()
  email: string;

  @IsPhoneNumber(null, { message: 'El número de teléfono no es válido.' })
  @Column()
  phone_number: string;

  @OneToMany(() => AddressEntity, address => address.client)
  addresses: AddressEntity[];

  @IsOptional()
  @IsDate({ message: 'La fecha de creación debe ser una fecha válida.' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @IsOptional()
  @IsDate({ message: 'La fecha de actualización debe ser una fecha válida.' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
