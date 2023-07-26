import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from "./bot/telegram.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { ApplicationModule } from "./application/application.module";
import { EmailModule } from "./email/email.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    TelegramModule,
    UserModule,
    ApplicationModule,
    EmailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
