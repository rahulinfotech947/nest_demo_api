import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class userSettings {
  @Prop({ required: false })
  receivedNotifications?: boolean;

  @Prop({ required: false })
  receivedEmails?: boolean;

  @Prop({ required: false })
  receivedSMS?: boolean;
}

export const userSettingsSchema= SchemaFactory.createForClass(userSettings)