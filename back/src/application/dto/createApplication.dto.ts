import { IsOptional, IsString, MinLength } from 'class-validator'

export class CreateApplicationDto {

    @IsString()
    @MinLength(1)
    user: string;

    @IsString()
    @MinLength(1)
    service: string;

    @IsString()
    @MinLength(3)
    contactType: string;

    @IsString()
    @IsOptional()
    country?: string;

}
