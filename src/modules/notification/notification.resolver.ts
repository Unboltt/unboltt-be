import { Args, Query, Mutation, Resolver } from "@nestjs/graphql";
import { Notification, NotificationPageInput, NotificationPageResult, QueryNotificationInput } from "./notification.model";
import { NotificationService } from "./notification.service";
import { UseGuards } from "@nestjs/common";
import { GqlJwtGuard } from "../auth/guards/gql.jwt.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/roles.enum";
import { GqlCurrentUser } from "../auth/decorators/gql.user.decorator";

@Resolver(of => Notification)
export class NotificationResolver{
    constructor(private notificationService: NotificationService){}

    @Query(returns => Notification, {name:"findOneNotification"})
    @UseGuards(GqlJwtGuard)
    @Roles(Role.USER)
    async findOne(@Args("notification") notification: QueryNotificationInput, @GqlCurrentUser() user: any): Promise<Notification>{
        const notifications = {...notification, userId: user._id} as any;
        return this.notificationService.findOne(notifications) as any;
    }
    @Query(returns => [Notification], {name:"findNotifications"})
    @UseGuards(GqlJwtGuard)
    @Roles(Role.USER)
    async find(@Args("notification") notification: QueryNotificationInput, @GqlCurrentUser() user: any): Promise<Notification[]>{
        const notifications = {...notification, userId: user._id} as any;
        return this.notificationService.find(notifications) as any;
    }

    @Mutation(returns => Boolean, {name:"deleteNotifications"})
    @UseGuards(GqlJwtGuard)
    @Roles(Role.USER)
    async delete(@Args("userId") userId:string):Promise<Boolean>{
        await this.notificationService.delete(userId);
        return true;
    }

    @Query((returns) => NotificationPageResult, { name: 'notificationPage' })
    @UseGuards(GqlJwtGuard)
    @Roles(Role.USER)
    public async page(@Args('query') query: QueryNotificationInput, @Args("page") page: NotificationPageInput) {
      return this.notificationService.page(query as any, page);
    }
}