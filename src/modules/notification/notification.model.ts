import { Field, ID, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { NotificationType } from "./notification.enum";

registerEnumType(NotificationType, {
    name: "NotificationType"
});

@ObjectType()
export class Notification{
    @Field((type)=>ID)
    _id: string;

    @Field((type)=>ID)
    userId: string;

    @Field((type)=>ID)
    refId: string;

    @Field({})
    message: string;

    @Field((type)=>NotificationType)
    type: NotificationType;

    @Field({nullable: true})
    createdAt?: number;
}

@InputType()
export class CommonNotificationInput{
    @Field((type)=>ID, {nullable: true})
    _id?: string;

    // @Field((type)=>ID, {nullable: true})
    // userId?: string;

    @Field((type)=>ID, {nullable: true})
    refId?: string;

    @Field((type)=>NotificationType, {nullable: true})
    type?: NotificationType;
}

@InputType()
export class CreateNotificationInput{
    @Field((type)=>ID)
    userId: string;

    @Field((type)=>ID)
    refId: string;

    @Field({})
    message: string;

    @Field((type)=>NotificationType)
    type: NotificationType;
}

@InputType()
export class QueryNotificationInput extends CommonNotificationInput{}

@InputType()
export class NotificationPageInput {
  @Field((type) => Number, { nullable: false })
  skip: number;
  @Field((type) => Number, { nullable: false })
  limit: number;
  @Field((type) => String, { nullable: true })
  keyword: string;
}

@ObjectType()
export class NotificationPageResult {
  @Field((type) => Number, { nullable: false })
  totalRecords: number;
  @Field((type) => [Notification])
  data: [Notification];
}