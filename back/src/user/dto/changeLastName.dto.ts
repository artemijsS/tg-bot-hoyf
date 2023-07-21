import { IsNumber, IsString, MinLength } from 'class-validator'

export class ChangeLastNameDto {
    @IsNumber()
    chatId: number;

    @IsString()
    @MinLength(2, { message: 'Фамилия не может быть короче 2 символов' })
    lastname: string;
}
