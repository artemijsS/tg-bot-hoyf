import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { validate } from 'class-validator';
import { plainToInstance } from "class-transformer";
import { Application } from "./schema/application.schema";
import { UserService } from "../user/user.service";
import { CreateApplicationDto } from "./dto/createApplication.dto";


@Injectable()
export class ApplicationService {
    constructor(
        @InjectModel('applications') private applicationModel: Model<Application>,
        private userService: UserService
    ) {}


    async createApplication(createApplicationDto: CreateApplicationDto) {
        await this.validation(CreateApplicationDto, createApplicationDto);

        const application = new this.applicationModel(createApplicationDto);

        await application.save();

        return application;
    }


    private async validation<T extends object>(dtoClass: new () => T, dto: any): Promise<T> {
        const dtoCheck = plainToInstance(dtoClass, dto);
        const errors = await validate(dtoCheck);

        if (errors.length > 0) {
            const errorMessage = errors.map(error => Object.values(error.constraints)).join('\n');
            throw new BadRequestException(errorMessage);
        }

        return dtoCheck as T;
    }
}
