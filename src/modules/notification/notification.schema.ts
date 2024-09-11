import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NotificationType } from './notification.enum';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  _id: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  refId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({required: true, enum: NotificationType})
  type: NotificationType;

  @Prop({})
  createdAt?: number;
}


export const NotificationSchema = SchemaFactory.createForClass(Notification);

export class PageResult<T> {
  totalRecords: number;
  data: Array<T>;
}

export class PageParams {
  skip?: number;
  limit?: number;
  keyword?: string;
}

export const handlePageFacet = (page: PageParams) => {
  return {
      $facet: {
          data: [{ $skip: Number(page.skip) }, { $limit: Number(page.limit) }],
          totalRecords: [{ $count: "count" }],
      },
  };
};

export const handlePageResult = (res: any) => {
  let rs = res[0] as any;
  if (rs.totalRecords.length)
      rs = { ...rs, totalRecords: rs.totalRecords[0].count };
  else rs = { ...rs, totalRecords: 0 };

  return rs;
};