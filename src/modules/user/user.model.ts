import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { CloudinaryFileUploadObject } from '../upload/upload.model';

@ObjectType()
export class AccountDetails{
  @Field()
  bank: string;

  @Field()
  name: string;

  @Field()
  number: string;

  @Field()
  code: string;

  @Field({nullable: true})
  recipient_code?: string;
}

@InputType()
export class AccountDetailsInput{
  @Field()
  bank: string;

  @Field()
  name: string;

  @Field()
  number: string;

  @Field()
  code: string;

  @Field({nullable: true})
  recipient_code?: string;
}

@ObjectType()
export class User {
  @Field()
  _id: string;

  @Field()
  walletID: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password:string;

  @Field({nullable: true})
  avatar?: CloudinaryFileUploadObject;

  @Field({nullable: true})
  account_details?: AccountDetails;

  @Field(type => [String], {nullable: true})
  refreshToken?: String[];

  @Field(type => [String], {nullable: true})
  roles?: String[];

  @Field()
  isEmailConfirmed: boolean;

  @Field()
  isRegComplete: boolean;

}

@InputType()
export class CreateUserInput {
  @Field({nullable:true})
  walletID?: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password:string;

  @Field({nullable: true})
  account_details?: AccountDetailsInput;

  @Field(type => [String], {nullable: true})
  refreshToken?: String[];
  
  @Field(type => [String], {nullable: true})
  roles?: String[];

  @Field({nullable: true})
  createdAt?: number;

  @Field({nullable: true})
  updatedAt?: number;
}


@InputType()
class UserInput {
  @Field({nullable: true})
  walletID?: string;

  @Field({nullable: true})
  firstName?: string;

  @Field({nullable: true})
  lastName?: string;

  @Field({nullable: true})
  email?: string;

  @Field({nullable: true})
  username?: string;

  @Field(type => GraphQLUpload, {nullable: true})
  avatar?: FileUpload;

  @Field({nullable: true})
  account_details?: AccountDetailsInput;

  @Field({nullable: true})
  isEmailConfirmed?: boolean;

  @Field({nullable: true})
  isRegComplete?: boolean;
}

@InputType()
export class QueryUserInput extends UserInput {}

@InputType()
export class UserPageInput {
  @Field((type) => Number, { nullable: false })
  skip?: number;

  @Field((type) => Number, { nullable: false })
  take?: number;

  @Field((type) => String, { nullable: true })
  keyword?: string;

  @Field((type) => Boolean, { nullable: true })
  isEmailConfirmed?: boolean;

  @Field((type) => Boolean, { nullable: true })
  isRegComplete?: boolean;
}

@ObjectType()
export class UserSummary {
  @Field()
  totalCount: number;
}

@ObjectType()
export class UserPageResult {
  @Field((type) => Number, { nullable: false })
  totalRecords: number;

  @Field((type) => UserSummary, { nullable: false })
  summary: UserSummary;

  @Field((type) => [User])
  data: [User];
}
