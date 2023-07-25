import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document, Model } from 'mongoose';
import { User } from "../../user/schema/user.schema";

export type ApplicationDocument = Document & Application;

@Schema({ collection: 'applications', timestamps: true })
export class Application {

    @Prop({
        type: Number,
        unique: true
    })
    applicationNumber: number;

    @Prop({
        type: Types.ObjectId, ref: 'users'
    })
    user: User;

    @Prop({
        type: String,
        required: true
    })
    service: string;

    @Prop({
        type: String,
        required: true
    })
    contactType: string;

    @Prop({
        required: true,
        type: String,
        default: "ACTIVE"
    })
    status: string;

    @Prop({
        required: false,
        type: String
    })
    country?: string;

    _id: Types.ObjectId;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

ApplicationSchema.pre<ApplicationDocument>('save', async function (next) {
    if (!this.applicationNumber) {
        const model = this.constructor as Model<ApplicationDocument>;
        const lastApplication = await model.findOne({}, { applicationNumber: 1 }, { sort: { applicationNumber: -1 } });
        this.applicationNumber = (lastApplication?.applicationNumber || 0) + 1;
    }
    next();
});
