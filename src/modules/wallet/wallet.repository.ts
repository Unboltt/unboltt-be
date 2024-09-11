import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Wallet, WalletDocument } from "./wallet.schema";

@Injectable()
export class WalletRepository {
  constructor(
    @InjectModel(Wallet.name)
    private WalletModel: Model<WalletDocument>
  ) {}

  public async create(model: Wallet): Promise<Wallet> {
    if (model.userId) model.userId = new Types.ObjectId(model.userId);

    const createdWallet = new this.WalletModel({
      ...this.mapIds(model),
      createdAt: Date.now(),
    });
    return await createdWallet.save();
  }

  public async update(id: string, model: Partial<Wallet>): Promise<Wallet> {
    await this.WalletModel.updateOne(
      { _id: id },
      {
        ...this.mapIds(model),
        updatedAt: Date.now(),
      }
    );
    return this.findById(id);
  }

  public async delete(model: Partial<Wallet>): Promise<void> {
    await this.WalletModel.deleteMany(this.mapIds(model));
  }

  //   public async delete (id: string): Promise<void>  {
  //     await this.WalletModel.deleteOne({ _id: new Types.ObjectId(id) });
  //   }

  public async find(query: Partial<Wallet>): Promise<Array<Wallet>> {
    return await this.WalletModel.find(this.mapIds(query));
  }

  public async findOne(query: Partial<Wallet>) {
    return await this.WalletModel.findOne(this.mapIds(query));
  }

  public async findById(id: string) {
    return await this.WalletModel.findById(id);
  }

  private mapIds(model: Partial<Wallet>): Partial<Wallet>{
    if (model._id) model._id = new Types.ObjectId(model._id);
    if (model.userId) model.userId = new Types.ObjectId(model.userId);

    return model
  }
}
