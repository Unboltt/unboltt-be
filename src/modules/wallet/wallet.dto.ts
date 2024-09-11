import { Field, ID, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";

@ObjectType()
export class Wallet {
  @Field((type) => ID)
  _id?: string;

  @Field((type) => ID)
  userId: string;

  @Field((type) => Number, { nullable: true })
  balance?: number;

  @Field((type) => Number, { nullable: true })
  total_amount_spent?: number;

  @Field((type) => Number, { nullable: true })
  total_amount_topup?: number;

  @Field((type) => Number, { nullable: true })
  createdAt?: number;

  @Field((type) => Number, { nullable: true })
  updatedAt?: number;
}

@InputType()
export class CreateWalletInput {
  @Field((type) => String)
  userId: string;
}

@InputType()
export class CommonWalletInput {
  @Field((type) => ID, { nullable: true })
  _id?: string;

  @Field((type) => ID, { nullable: true })
  userId?: string;

  @Field((type) => Number, { nullable: true })
  balance?: number;

  @Field((type) => Number, { nullable: true })
  total_amount_spent?: number;

  @Field((type) => Number, { nullable: true })
  total_amount_topup?: number;
}

@InputType()
export class UpdateWalletInput extends CommonWalletInput {}

@InputType()
export class QueryWalletInput extends CommonWalletInput {}