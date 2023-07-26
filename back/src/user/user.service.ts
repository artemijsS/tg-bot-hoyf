import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { User } from './schema/user.schema';
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/createUser.dto";
import { validate } from 'class-validator';
import { plainToInstance } from "class-transformer";
import { ChangeNameDto } from "./dto/changeName.dto";
import { ChangeEmailDto } from "./dto/changeEmail.dto";
import { ChangeUsernameDto } from "./dto/changeUsername.dto";


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

  async getByChatId(chatId: number): Promise<User> {
    return this.userModel.findOne({ chatId: chatId }).exec();
  }

  async getById(id: number): Promise<User> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async getAdminChatIds(): Promise<number[]> {
    const admins = await this.userModel.find({ role: "admin" }).exec();
    return admins.map((admin: User) => admin.chatId);
  }

  async changeName(changeNameDto: ChangeNameDto) {
    await this.validation(ChangeNameDto, changeNameDto);
    return this.userModel.findOneAndUpdate({ chatId: changeNameDto.chatId }, { name: changeNameDto.name }).select('-password');
  }

  async changeEmail(changeEmailDto: ChangeEmailDto) {
    await this.validation(ChangeEmailDto, changeEmailDto);
    return this.userModel.findOneAndUpdate({ chatId: changeEmailDto.chatId }, { email: changeEmailDto.email }).select('-password');
  }

  async changeTgUsername(changeUsernameDto: ChangeUsernameDto) {
    await this.validation(ChangeUsernameDto, changeUsernameDto);
    return this.userModel.findOneAndUpdate({ chatId: changeUsernameDto.chatId }, { username: changeUsernameDto.username }).select('-password');
  }

  async getUsersByUsername(page: number = 0) {
    const limit = 8;
    const userCount = await this.userModel.find().countDocuments();
    const totalPages = Math.round(userCount / limit);
    return {
      users: await this.userModel.find().sort({createdAt: 1}).skip(page * limit).limit(limit),
      page: page,
      totalPages
    };
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
