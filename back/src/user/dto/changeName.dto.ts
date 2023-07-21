import { IsNumber, IsString, MinLength } from 'class-validator'

export class ChangeNameDto {
    @IsNumber()
    chatId: number;

    @IsString()
    @MinLength(2, { message: 'Имя не может быть короче 2 символов' })
    name: string;
}
