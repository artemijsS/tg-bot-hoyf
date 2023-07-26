import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator'

export class SendApplicationDto {

    @IsNumber()
    applicationNumber: number;

    @IsString()
    @IsEmail()
    to: string;

    @IsString()
    @MinLength(1)
    username: string;

    @IsString()
    @MinLength(1)
    service: string;

    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(3)
    contactType: string;

    @IsString()
    @IsOptional()
    country?: string;
}
