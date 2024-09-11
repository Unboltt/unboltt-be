import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  PageParams,
  PageResult,
  WalletTransaction,
  WalletTransactionDocument,
  handlePageFacet,
  handlePageResult,
} from "./transaction.schema";

@Injectable()
export class WalletTransactionRepository {
  constructor(
    @InjectModel(WalletTransaction.name)
    private walletTransactionModel: Model<WalletTransactionDocument>
  ) {}

  public async create(model: WalletTransaction): Promise<WalletTransaction> {
    const createdWallet = new this.walletTransactionModel({
      ...this.mapIds(model),
      createdAt: Date.now(),
    });
    return await createdWallet.save();
  }

  public async update(
    id: string,
    model: Partial<WalletTransaction>
  ): Promise<WalletTransaction> {
    await this.walletTransactionModel.updateOne(
      { _id: id },
      {
        ...this.mapIds(model),
        updatedAt: Date.now(),
      }
    );
    return this.findById(id);
  }

  public async delete(model: Partial<WalletTransaction>): Promise<void> {
    await this.walletTransactionModel.deleteMany(this.mapIds(model));
  }

  //   public async delete (id: string): Promise<void>  {
  //     await this.walletTransactionModel.deleteOne({ _id: new Types.ObjectId(id) });
  //   }

  public async find(
    query: Partial<WalletTransaction>
  ): Promise<Array<WalletTransaction>> {
    return await this.walletTransactionModel.find(this.mapIds(query));
  }

  public async findOne(
    query: Partial<WalletTransaction>
  ): Promise<WalletTransaction> {

    return await this.walletTransactionModel.findOne(this.mapIds(query));
  }

  public async findById(id: string): Promise<WalletTransaction> {
    return await this.walletTransactionModel.findById(id);
  }

  seed = async () => {};

  public async page(query: Partial<WalletTransaction>, page: PageParams): Promise<PageResult<WalletTransaction>> {
    return this.walletTransactionModel.aggregate([
      {$match: this.mapIds(query)},
      { $sort: { createdAt: -1 } },
      { ...handlePageFacet(page) },
    ])
    .then(handlePageResult)
    .then((rs) => {
      return rs;
    });
  }
  
  public async count(query: Partial<WalletTransaction>) {
    return this.walletTransactionModel.countDocuments(this.mapIds(query));
  }

  private mapIds(model: Partial<WalletTransaction>): Partial<WalletTransaction>{
    if(model._id) model._id = new Types.ObjectId(model._id);
    if(model.userId) model.userId = new Types.ObjectId(model.userId);
    if(model.vaultId) model.vaultId = new Types.ObjectId(model.vaultId);
    if(model.walletId) model.walletId = new Types.ObjectId(model.walletId);
    return model;
}
}
