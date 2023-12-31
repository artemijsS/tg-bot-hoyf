import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { UserService } from "./user.service";

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
    ],
    controllers: [],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
