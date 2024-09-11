import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type VaultAccessDocument = VaultAccess & Document;

@Schema({collection:"vault_access"})
export class VaultAccess{
    _id: Types.ObjectId;

    @Prop({required:true})
    vaultId: Types.ObjectId;

    @Prop({required:true})
    file_links: string[];

    @Prop({required:true, unique: true})
    link: string;

    @Prop()
    createdAt?: number;
}

export const VaultAccessSchema = SchemaFactory.createForClass(VaultAccess);

export class PageResult<T> {
    totalRecords: number;
    data: Array<T>;
}
  
export class PageParams {
    skip?: number;
    limit?: number;
    vaultId?: string;
}

export const handlePageFacet = (page: PageParams) => {
    return {
        $facet: {
        data: [{ $skip: Number(page.skip) }, { $limit: Number(page.limit) }],
        totalRecords: [{ $count: "count" }],
        },
    }
}
  
export const handlePageResult = (res: any) => {
    let rs = res[0] as any;
    if (rs.totalRecords.length)
        rs = { ...rs, totalRecords: rs.totalRecords[0].count };
    else rs = { ...rs, totalRecords: 0 };

    return rs;
}