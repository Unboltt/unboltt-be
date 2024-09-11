import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.respository';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PaymentModule } from '../payment/payment.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PaymentModule
  ],
  controllers: [UserController],
  providers: [UserResolver, UserService, UserRepository],
  exports:[UserService, UserRepository]
})
export class UserModule {}
