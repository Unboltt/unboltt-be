import {
    Field,
    ID,
    InputType,
    ObjectType
} from "@nestjs/graphql";
  
@ObjectType()
export class VaultAccess {
    @Field(type=>ID, {})
    _id: string;

    @Field((type) => ID, { nullable: false })
    vaultId: string;

    @Field((type) => [String])
    file_links: string[];

    @Field()
    link: string;

    @Field({nullable: true})
    createdAt?: number;
}

@InputType()
export class VaultAccessInput {
    @Field((type) => ID, { nullable: true })
    vaultId?: string;

    @Field((type) => [String], { nullable: true })
    file_links?: string[];

    @Field({ nullable: true })
    link?: string;
}

@InputType()
export class CreateVaultAccessInput {
    @Field((type) => ID, { nullable: false })
    vaultId: string;

    @Field((type) => [String])
    file_links: string[];

    @Field()
    link: string;
}

@InputType()
export class UpdateVaultAccessInput extends VaultAccessInput {}

@InputType()
export class QueryVaultAccessInput extends VaultAccessInput {}

@InputType()
export class VaultAccessPageInput {
    @Field((type) => Number, { nullable: false })
    skip?: number;

    @Field((type) => Number, { nullable: false })
    take?: number;

    @Field((type) => String, { nullable: true })
    vaultId?: string;
}

@ObjectType()
export class VaultAccessSummary {
    @Field()
    totalCount: number;
}

@ObjectType()
export class VaultAccessPageResult {
    @Field((type) => Number, { nullable: false })
    totalRecords: number;

    @Field((type) => VaultAccessSummary, { nullable: false })
    summary: VaultAccessSummary;

    @Field((type) => [VaultAccess])
    data: [VaultAccess];
}