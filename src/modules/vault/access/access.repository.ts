import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PageParams, PageResult, VaultAccess, VaultAccessDocument, handlePageFacet, handlePageResult } from "./access.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class VaultAccessRepository{
    constructor(@InjectModel(VaultAccess.name) private vaultModel: Model<VaultAccessDocument>){}

    public async create(vault: VaultAccess): Promise<VaultAccess>{
        const createVault = new this.vaultModel(this.mapIds(vault));
        return createVault.save();
    }

    public async update(_id: string, vault: Partial<VaultAccess>): Promise<void>{
        delete vault._id;
        await this.vaultModel.updateOne({ _id: new Types.ObjectId(_id)}, this.mapIds(vault));
    }

    public async findOne(vault: Partial<VaultAccess>): Promise<VaultAccess>{
        return this.vaultModel.findOne(this.mapIds(vault));
    }

    public async find(vault: Partial<VaultAccess>): Promise<VaultAccess[]>{
        return this.vaultModel.find(this.mapIds(vault));
    }

    public async delete(_id: string): Promise<void>{
        await this.vaultModel.deleteOne({ _id: new Types.ObjectId(_id) });
    }

    public async page(query: Partial<VaultAccess>, page: PageParams): Promise<PageResult<VaultAccess>> {
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

    public async count(query: Partial<VaultAccess>) {
        return this.vaultModel.countDocuments(this.mapIds(query));
    }

    private mapIds(model: Partial<VaultAccess>): Partial<VaultAccess>{
        if(model._id) model._id = new Types.ObjectId(model._id);
        if(model.vaultId) model.vaultId = new Types.ObjectId(model.vaultId);
        return model;
    }
}