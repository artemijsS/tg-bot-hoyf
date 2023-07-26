import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { EmailService } from "./email.service";

@Module({
    imports: [
        ConfigModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get("EMAIL_SERVER"),
                    port: 587,
                    secure: false,
                    auth: {
                        user: configService.get("EMAIL_LOGIN"),
                        pass: configService.get("EMAIL_PASSWORD"),
                    },
                },
                defaults: {
                    from: configService.get("EMAIL_LOGIN"),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {}
