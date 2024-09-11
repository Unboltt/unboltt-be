import { Injectable } from "@nestjs/common";
import { VaultAccessRepository } from "./access.repository";
import { PageParams, PageResult, VaultAccess } from "./access.schema";

@Injectable()
export class VaultAccessService{
    constructor(
        private vaultRepo: VaultAccessRepository,
    ){}

    public async create(model: VaultAccess): Promise<VaultAccess> {
        const vault =  await this.vaultRepo.create({
            ...model,
            createdAt: Date.now(),
        });

        return vault;
    }
    
    public async update(id: string, model: Partial<VaultAccess>): Promise<VaultAccess> {

        await this.vaultRepo.update(id, model);

        return this.vaultRepo.findOne({ _id: id } as any);
    }

    public async delete(id: string): Promise<Boolean> {
        await this.vaultRepo.delete(id);
        return true;
    }

    public async findOne(model: Partial<VaultAccess>): Promise<VaultAccess> {
        return this.vaultRepo.findOne(model);
    }

    public async find(model: Partial<VaultAccess>): Promise<VaultAccess[]> {
        return this.vaultRepo.find(model);
    }

    public async page(query: Partial<VaultAccess>, page: PageParams): Promise<PageResult<VaultAccess>> {
        return this.vaultRepo.page(query, page);
    }

    public async count(query: Partial<VaultAccess>){
        return this.vaultRepo.count(query);
    }
}