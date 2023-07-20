import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TelegramUpdate } from "./telegram.update";
import { TelegrafModule } from "nestjs-telegraf";
import { RegistrationScene } from "./scenes/registration.scene";
import * as LocalSession from "telegraf-session-local";
import { MenuScene } from "./scenes/menu.scene";
import { ChangeInfoScene } from "./scenes/settings/changeInfo.scene";
import { SettingsScene } from "./scenes/settings.scene";
import { UserModule } from "../user/user.module";
import { ShowServicesScene } from "./scenes/services/showServices.scene";
import { WriteToUsScene } from "./scenes/settings/writeToUs.scene";

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
        UserModule
    ],
    controllers: [],
    providers: [
        TelegramUpdate,
        RegistrationScene,
        MenuScene,
        ChangeInfoScene,
        SettingsScene,
        ShowServicesScene,
        WriteToUsScene
    ]
})
export class TelegramModule {}
