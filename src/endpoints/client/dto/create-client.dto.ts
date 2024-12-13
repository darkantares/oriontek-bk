import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsDate, Length, ValidateNested } from 'class-validator';
import { AddressEntity } from 'src/endpoints/address/entities/address.entity';

export class CreateClientDto {
  @IsString()
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres.' })
  firstName: string;

  @IsString()
  @Length(2, 50, { message: 'El apellido debe tener entre 2 y 50 caracteres.' })
  lastName: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email: string;

  @IsPhoneNumber(null, { message: 'El número de teléfono no es válido.' })
  phone_number: string;

  @ValidateNested() // Si decides usarlo, valida los objetos Address aquí.
  @Type(() => AddressEntity) // Transformará automáticamente las propiedades.
  addresses: AddressEntity[];

  @IsOptional()
  @IsDate({ message: 'La fecha de creación debe ser una fecha válida.' })
  created_at?: Date;

  @IsOptional()
  @IsDate({ message: 'La fecha de actualización debe ser una fecha válida.' })
  updated_at?: Date;
}
