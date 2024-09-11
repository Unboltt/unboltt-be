import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PageParams, PageResult, Vault, VaultDocument, handlePageFacet, handlePageResult } from "./vault.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class VaultRepository{
    constructor(@InjectModel(Vault.name) private vaultModel: Model<VaultDocument>){}

    public async create(vault: Vault): Promise<Vault>{
        const createVault = new this.vaultModel(this.mapIds(vault));
        return createVault.save();
    }

    public async update(_id: string, vault: Partial<Vault>): Promise<void>{
        delete vault._id;
        await this.vaultModel.updateOne({ _id: new Types.ObjectId(_id)}, this.mapIds(vault));
    }

    public async findOne(vault: Partial<Vault>): Promise<Vault>{
        return this.vaultModel.findOne(this.mapIds(vault));
    }

    public async find(vault: Partial<Vault>): Promise<Vault[]>{
        return this.vaultModel.find(this.mapIds(vault));
    }

    public async delete(_id: string): Promise<void>{
        await this.vaultModel.deleteOne({ _id: new Types.ObjectId(_id) });
    }

    public async page(query: Partial<Vault>, page: PageParams): Promise<PageResult<Vault>> {
        return this.vaultModel.aggregate([
            {$match: query},
            { $sort: { createdAt: -1 } },
            { ...handlePageFacet(page) },
        ])
        .then(handlePageResult)
        .then((rs) => {
            return rs;
        });
    }

    public async count(query: Partial<Vault>) {
        return this.vaultModel.countDocuments(this.mapIds(query));
    }

    private mapIds(model: Partial<Vault>): Partial<Vault>{
        if(model._id) model._id = new Types.ObjectId(model._id);
        if(model.userId) model.userId = new Types.ObjectId(model.userId);
        return model;
    }
}