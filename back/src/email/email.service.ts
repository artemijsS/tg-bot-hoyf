import { BadRequestException, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from "class-transformer";
import { MailerService } from "@nestjs-modules/mailer";
import { SendApplicationDto } from "./dto/sendApplication.dto";


@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendApplicationEmail(sendApplicationDto: SendApplicationDto) {
        await this.validation(SendApplicationDto, sendApplicationDto);

        const title = `#${sendApplicationDto.applicationNumber} | ${sendApplicationDto.service} | ${sendApplicationDto.username}`

        const text = `Новая заявка!
        
Номер заявки - ${sendApplicationDto.applicationNumber}
Услуга - ${sendApplicationDto.service}
${sendApplicationDto.country ? "Страна - " + sendApplicationDto.country + "\n" : ""}
Желаемый тип обратной связи - ${sendApplicationDto.contactType} - ${sendApplicationDto.contactType === "Telegram" ? "@"+sendApplicationDto.username : sendApplicationDto.email }


Инфо клиента:
Имя - ${sendApplicationDto.name}
Почта - ${sendApplicationDto.email}
Telegram - @${sendApplicationDto.username}
        
        `

        await this.mailerService.sendMail({
            to: sendApplicationDto.to,
            subject: title,
            text: text,
        });
    }


    async validation<T extends object>(dtoClass: new () => T, dto: any): Promise<T> {
        const dtoCheck = plainToInstance(dtoClass, dto);
        const errors = await validate(dtoCheck);

        if (errors.length > 0) {
            const errorMessage = errors.map(error => Object.values(error.constraints)).join('\n');
            throw new BadRequestException(errorMessage);
        }

        return dtoCheck as T;
    }
}
