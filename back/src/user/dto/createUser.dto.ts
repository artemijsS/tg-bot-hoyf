import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
    @IsNumber()
    chatId: number;

    @IsString()
    @MinLength(1)
    username: string;

    @IsString()
    @MinLength(2, { message: 'Имя не может быть короче 2 символов' })
    name: string;

    @IsString()
    @IsEmail({}, { message: 'Неправильный формат почты' })
    email: string;

}
