import { ForbiddenException, Injectable } from "@nestjs/common";
import { NotificationRepository } from "./notification.repository";
import { Notification, PageParams, PageResult } from "./notification.schema";
import { UserService } from "../user/user.service";

@Injectable()
export class NotificationService{
    constructor(private notificationRepository: NotificationRepository, private userService:UserService){}
    
    public async create(notification: Notification): Promise<Notification> {
        const user = await this.userService.findOne({_id: notification.userId});
        if(!user){
            throw new ForbiddenException("Cannot create notification, no user found.");
        }
        return this.notificationRepository.create({...notification, createdAt: Date.now()});
    }

    public async updateOne(_id: string, notification: Partial<Notification>): Promise<void> {
        await this.notificationRepository.updateOne(_id, notification);
    }

    public async findOne(notification: Partial<Notification>): Promise<Notification> {
        return this.notificationRepository.findOne(notification);
    }

    public async find(notification: Partial<Notification>): Promise<Notification[]> {
        return this.notificationRepository.find(notification);
    }

    public async delete(userId: string): Promise<void> {
        await this.notificationRepository.delete(userId);
    }

    async page(project: Partial<Notification>, page: PageParams): Promise<PageResult<Notification>>{
        return this.notificationRepository.page(project, page);
      }
}