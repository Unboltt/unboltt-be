import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { ImagekitFileUploadObject, ImagekitUploadObject } from "../upload/upload.schema";

export type VaultDocument = Vault & Document;

@Schema()
export class Vault{
    _id: Types.ObjectId;

    @Prop({required:true})
    userId: Types.ObjectId;

    @Prop({required:true})
    name: string;

    @Prop({required:true})
    price: number;

    @Prop({required:true, unique: true})
    link: string;

    @Prop({required:true, default: true})
    isPublished: boolean;

    @Prop()
    files?: ImagekitUploadObject[];

    @Prop()
    createdBy?: string;

    @Prop()
    createdAt?: number;

    @Prop()
    updatedBy?: string;

    @Prop()
    updatedAt?: number;
}

export const VaultSchema = SchemaFactory.createForClass(Vault);

export class PageResult<T> {
    totalRecords: number;
    data: Array<T>;
}
  
export class PageParams {
    skip?: number;
    limit?: number;
    keyword?: string;
    isPublished?: boolean;
    userID?: string;
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