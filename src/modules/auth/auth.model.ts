import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsAlpha,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from '../user/user.model';

@ObjectType()
export class Details extends PartialType(User) {
  @Field()
  name: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field(() => Details)
  details: Details;
}

@InputType()
export class UserSignUp {
  @IsNotEmpty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(20)
  @Field()
  firstName: string;

  @IsNotEmpty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(20)
  @Field()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  @Field({ nullable: true })
  username: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  @Field()
  password: string;

  @Field((type) => [String], { nullable: true })
  roles: String[];
}

@InputType()
export class UserSignIn {
  @IsNotEmpty()
  @Field()
  username: string;

  @IsNotEmpty()
  @Field()
  password: string;
}

@InputType()
export class UserChangePassword {
  @Field()
  oldPassword: string;

  @Field()
  newPassword: string;
}

@ObjectType()
export class Tokens {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;
}
