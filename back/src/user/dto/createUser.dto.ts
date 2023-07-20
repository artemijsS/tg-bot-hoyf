import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
    @IsNumber()
    chatId: number;

    @IsString()
    @MinLength(1)
    username: string;

    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @MinLength(2)
    lastname: string;

    @IsString()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

}
