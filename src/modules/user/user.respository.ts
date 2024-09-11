import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PageParams, PageResult, User, UserDocument, handlePageFacet, handlePageResult } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public create(user: User): Promise<User> {
    const createUser = new this.userModel(this.mapIds(user));
    return createUser.save();
  }

  public async update(_id: string, user: Partial<User>): Promise<void> {
    delete user._id;
    await this.userModel.updateOne({ _id: new Types.ObjectId(_id)}, user);
  }

  public async findOne(user: Partial<User>): Promise<User> {
    return this.userModel.findOne(this.mapIds(user));
  }

  public async findOneAuth(user: Partial<User>): Promise<User> {
    return this.userModel.findOne({$or:[{username: user.username}, {email:user.email}]});
  }

  public async find(user: Partial<User>): Promise<User[]> {
    return this.userModel.find(this.mapIds(user));
  }

  public async delete(_id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: new Types.ObjectId(_id) });
  }

  public async page(query: Partial<User>, page: PageParams): Promise<PageResult<User>> {
    return this.userModel.aggregate([
        {$match: query},
        { $sort: { createdAt: -1 } },
        { ...handlePageFacet(page) },
    ])
    .then(handlePageResult)
    .then((rs) => {
        return rs;
    });
  }

  public async count(query: Partial<User>) {
    return this.userModel.countDocuments(this.mapIds(query));
  }

  private mapIds(model: Partial<User>): Partial<User>{
    if(model._id) model._id = new Types.ObjectId(model._id);
    if(model.walletID) model.walletID = new Types.ObjectId(model.walletID);
    return model;
  }

}
