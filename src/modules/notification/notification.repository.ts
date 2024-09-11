import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { NotificationDocument, Notification, PageParams, PageResult, handlePageFacet, handlePageResult } from "./notification.schema";

@Injectable()
export class NotificationRepository{
    constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>){}

    public async create(notification: Notification): Promise<Notification> {
        const createNotification = new this.notificationModel(this.mapIds(notification));
        return createNotification.save();
    }

    public async updateOne(_id: string, notification: Partial<Notification>): Promise<void> {
        delete notification._id;
        await this.notificationModel.updateOne({ _id: new Types.ObjectId(_id)},this.mapIds(notification));
    }

    public async findOne(notification: Partial<Notification>): Promise<Notification> {
        return await this.notificationModel.findOne(this.mapIds(notification));
    }

    public async find(notification: Partial<Notification>): Promise<Notification[]> {
        return await this.notificationModel.find(this.mapIds(notification));
    }

    public async delete(userId: string): Promise<void> {
        await this.notificationModel.deleteMany({ userId: new Types.ObjectId(userId) });
    }

    private mapIds(model: Partial<Notification>): Partial<Notification>{
        if(model._id) model._id = new Types.ObjectId(model._id);
        if(model.userId) model.userId = new Types.ObjectId(model.userId);
        if(model.refId) model.refId = new Types.ObjectId(model.refId);

        return model;
    }

    public async page(query: Partial<Notification>, page: PageParams): Promise<PageResult<Notification>> {
        return this.notificationModel.aggregate([
          {$match: query},
          { $sort: { createdAt: -1 } },
          { ...handlePageFacet(page) },
        ])
        .then(handlePageResult)
        .then((rs) => {
          return rs;
        });
      }

}