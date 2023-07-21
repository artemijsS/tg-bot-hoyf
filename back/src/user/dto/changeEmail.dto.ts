import { IsEmail, IsNumber, IsString } from 'class-validator'

export class ChangeEmailDto {
    @IsNumber()
    chatId: number;

    @IsString()
    @IsEmail({}, { message: 'Неправильный формат почты' })
    email: string;
}
