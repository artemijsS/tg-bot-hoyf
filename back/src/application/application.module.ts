import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ApplicationSchema } from "./schema/application.schema";
import { UserSchema } from "../user/schema/user.schema";
import { ApplicationService } from "./application.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([
            { name: 'applications', schema: ApplicationSchema },
        ]),
        UserModule
    ],
    controllers: [],
    providers: [ApplicationService],
    exports: [ApplicationService]
})
export class ApplicationModule {}
