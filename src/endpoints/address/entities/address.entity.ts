import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { IsString, IsOptional, IsEnum, IsBoolean, IsDate, IsNotEmpty, IsUUID, IsPostalCode } from "class-validator";
import { Type } from "class-transformer";
import { ClientEntity } from "src/endpoints/client/entities/client.entity";

@Entity({ name: 'address' })
export class AddressEntity {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id: string;

    @Column()
    @IsString()
    @IsNotEmpty({ message: 'Street address is required' })
    street_address: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsEnum(['residential', 'commercial', 'other'], { message: 'Type must be residential, commercial, or other' })
    type?: "residential" | "commercial" | "other";

    @Column()
    @IsString()
    @IsNotEmpty({ message: 'City is required' })
    city: string;

    @Column()
    @IsString()
    @IsNotEmpty({ message: 'State is required' })
    state: string;

    @Column()
    @IsPostalCode('any', { message: 'Invalid zip code format' })
    zip_code: string;

    @Column()
    @IsString()
    @IsNotEmpty({ message: 'Country is required' })
    country: string;

    @Column({ type: 'timestamp' })
    @IsDate()
    @Type(() => Date) // Permite transformar strings a fechas automáticamente
    created_at: Date;

    @Column({ type: 'timestamp' })
    @IsDate()
    @Type(() => Date)
    updated_at: Date;

    @Column({ default: true })
    @IsBoolean()
    is_active: boolean;

    @ManyToOne(() => ClientEntity, client => client.addresses)
    @JoinColumn({ name: 'client_id' })
    client: ClientEntity;
}
