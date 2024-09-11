import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../auth/roles.enum';
import { CloudinaryFileUploadObject } from '../upload/upload.schema';

export type UserDocument = User & Document;

export class AccountDetails{
  @Prop()
  bank: string;

  @Prop()
  name: string;

  @Prop()
  number: string;

  @Prop()
  code: string;

  @Prop()
  recipient_code?: string;
}

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop()
  walletID: Types.ObjectId;

  @Prop({required: true})
  firstName: string;

  @Prop()
  lastName?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  password?: string;

  @Prop()
  avatar?: CloudinaryFileUploadObject;

  @Prop()
  account_details?: AccountDetails;

  @Prop()
  refreshToken: Array<String>;

  @Prop({required:true, default:[Role.USER]})
  roles: Array<String>;

  @Prop({required:true, default:false})
  isEmailConfirmed: boolean;

  @Prop({required:true, default:false})
  isRegComplete: boolean;

  @Prop()
  createdAt?: number;

  @Prop()
  updatedAt?: number;

  refresh_token: string;

  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export class PageResult<T> {
  totalRecords: number;
  data: Array<T>;
}

export class PageParams {
  skip?: number;
  limit?: number;
  keyword?: string;
  isEmailConfirmed?: boolean;
  isRegComplete?: boolean;
}

export const handlePageFacet = (page: PageParams) => {
  return {
      $facet: {
      data: [{ $skip: Number(page.skip) }, { $limit: Number(page.limit) }],
      totalRecords: [{ $count: "count" }],
      },
  }
}

export const handlePageResult = (res: any) => {
  let rs = res[0] as any;
  if (rs.totalRecords.length)
      rs = { ...rs, totalRecords: rs.totalRecords[0].count };
  else rs = { ...rs, totalRecords: 0 };

  return rs;
}
