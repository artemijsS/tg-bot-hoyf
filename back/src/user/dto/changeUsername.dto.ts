import { IsNumber, IsString, MinLength } from 'class-validator'

export class ChangeUsernameDto {
    @IsNumber()
    chatId: number;

    @IsString()
    @MinLength(1)
    username: string;
}
