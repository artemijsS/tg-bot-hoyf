import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TelegramUpdate } from "./telegram.update";
import { TelegrafModule } from "nestjs-telegraf";
import { RegistrationScene } from "./registration.scene";
import * as LocalSession from "telegraf-session-local";

const sessions = new LocalSession({ database: 'session_db.json' })

@Module({
    imports: [
        ConfigModule,
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                token: configService.get('BOT_TOKEN'),
                middlewares: [sessions.middleware()]
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [TelegramUpdate, RegistrationScene]
})
export class TelegramModule {}
