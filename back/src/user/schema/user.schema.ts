import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {

    @Prop({
        unique: true,
        required: true
    })
    chatId: number;

    @Prop({
        required: true
    })
    username: string;

    @Prop({
        required: true
    })
    name: string;

    @Prop({
        required: true
    })
    lastname: string;

    @Prop({
        required: true
    })
    email: string;

    @Prop({
        required: false
    })
    password: string;

    @Prop({
        default: "tg_user",
        required: true
    })
    role: string;

    _id: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
