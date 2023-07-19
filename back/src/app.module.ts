import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from "./bot/telegram.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegramModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
