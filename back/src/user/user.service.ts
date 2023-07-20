import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { User } from './schema/user.schema';
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/createUser.dto";
import { validate } from 'class-validator';
import { ClassConstructor, plainToClass, plainToInstance } from "class-transformer";


@Injectable()
export class UserService {
  constructor(@InjectModel('users') private userModel: Model<User>) {}

  async createUser(dto: CreateUserDto) {

    await this.validation(CreateUserDto, dto);

    if (await this.getByChatId(dto.chatId)) throw new BadRequestException("User with this username already registered")

    const user = new this.userModel(dto);

    await user.save();

    return user;
  }

  async getByChatId(chatId: number) {
    return this.userModel.findOne({ chatId: chatId });
  }

  async validation<T extends object>(dtoClass: new () => T, dto: any): Promise<T> {
    const dtoCheck = plainToInstance(dtoClass, dto);
    const errors = await validate(dtoCheck);

    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException(errorMessage);
    }

    return dtoCheck as T;
  }
}
