import {
    Field,
    ID,
    InputType,
    ObjectType
} from "@nestjs/graphql";
import { ImagekitFileUploadObject, ImagekitUpload, ImagekitUploadFileInput, ImagekitUploadObject } from "../upload/upload.model";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
  
  
@ObjectType()
export class Vault {
    @Field(type=>ID, {})
    _id: string;

    @Field((type) => ID, { nullable: false })
    userId: string;

    @Field()
    name: string;

    @Field()
    price: number;

    @Field()
    link: string;

    @Field()
    isPublished: boolean;

    @Field((type) => [ImagekitUploadObject], { nullable: true })
    files?: ImagekitUploadObject[];

    @Field((type)=>ID, {nullable: true})
    createdBy?: string;

    @Field({nullable: true})
    createdAt?: number;

    @Field((type)=>ID, {nullable: true})
    updatedBy?: string;

    @Field({nullable: true})
    updatedAt?: number;
}

@InputType()
export class VaultInput {
    @Field(type=>ID, { nullable: true })
    _id?: string;

    @Field((type) => ID, { nullable: true })
    userId?: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    price?: number;

    @Field({ nullable: true })
    link?: string;

    @Field({ nullable: true })
    isPublished?: boolean;

    @Field((type) => [ImagekitUpload], { nullable: true })
    files?: ImagekitUpload[];
}

@InputType()
export class CreateVaultInput {
    @Field((type) => ID, { nullable: true })
    userId?: string;

    @Field({nullable: true})
    name?: string;

    @Field()
    price: number;

    // @Field((type) => [GraphQLUpload], { nullable: true })
    // files?: FileUpload[];

    @Field((type) => [ImagekitUpload], { nullable: true })
    files?: ImagekitUpload[];
}

@InputType()
export class UpdateVaultInput extends VaultInput {}

@InputType()
export class QueryVaultInput extends VaultInput {}

@InputType()
export class VaultPageInput {
    @Field((type) => Number, { nullable: false })
    skip?: number;

    @Field((type) => Number, { nullable: false })
    take?: number;

    @Field((type) => String, { nullable: true })
    keyword?: string;

    @Field((type) => Boolean, { nullable: true })
    isPublished?: boolean;

    @Field((type) => String, { nullable: true })
    userId?: string;
}

@ObjectType()
export class VaultSummary {
    @Field()
    totalCount: number;
}

@ObjectType()
export class VaultPageResult {
    @Field((type) => Number, { nullable: false })
    totalRecords: number;

    @Field((type) => VaultSummary, { nullable: false })
    summary: VaultSummary;

    @Field((type) => [Vault])
    data: [Vault];
}