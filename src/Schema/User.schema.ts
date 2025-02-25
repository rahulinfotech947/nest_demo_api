import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { userSettings } from './Users.settings.schema';

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ unique: true, trim: true, required: true })
  email: string;

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'userSettings' })
  settings: userSettings;
}

export const userSchema = SchemaFactory.createForClass(User);
