import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/Schema/User.schema';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import {
  userSettings,
  userSettingsSchema,
} from 'src/Schema/Users.settings.schema';

const Tables = [
  { name: User.name, schema: userSchema },
  { name: userSettings.name, schema: userSettingsSchema },
];

@Module({
  imports: [MongooseModule.forFeature(Tables)],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware); // Apply your middleware
    // .forRoutes('users'); // Apply it only to the "users" route
    // .forRoutes("users");
  }
}
