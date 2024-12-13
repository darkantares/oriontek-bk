import { IsString, IsOptional, IsEnum, IsBoolean, IsDate, IsNotEmpty, IsPostalCode } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAddressDto {
    @IsString()
    @IsNotEmpty({ message: 'Street address is required' })
    street_address: string;

    @IsString()
    @IsNotEmpty({ message: 'City is required' })
    city: string;

    @IsString()
    @IsNotEmpty({ message: 'State is required' })
    state: string;

    @IsPostalCode('any', { message: 'Invalid zip code format' })
    zip_code: string;

    @IsString()
    @IsNotEmpty({ message: 'Country is required' })
    country: string;

    @IsDate()
    @Type(() => Date) // Permite transformar strings a fechas automáticamente
    created_at: Date;

    @IsDate()
    @Type(() => Date)
    updated_at: Date;

    @IsBoolean()
    is_active: boolean;
}
