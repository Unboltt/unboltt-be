import {
  Field,
  ID,
  InputType,
  ObjectType,
  PartialType,
  registerEnumType,
} from "@nestjs/graphql";
import { WalletTransactionStatus, WalletTransactionType } from "./transaction.enum";

registerEnumType(WalletTransactionStatus, {
  name: "WalletTransactionStatus",
});

registerEnumType(WalletTransactionType, {
  name: "WalletTransactionType",
});

@ObjectType()
export class WalletTransaction {
  @Field((type) => ID)
  _id?: string;

  @Field((type) => ID)
  userId: string;

  @Field((type) => ID)
  walletId: string;

  @Field((type) => String, { nullable: true })
  transactionId?: string;
  
  @Field((type) => ID, { nullable: true })
  vaultId?: string;

  @Field((type) => String, { nullable: true })
  authorization_url?: string;

  @Field((type) => String, { nullable: true })
  transfer_code?: string;

  @Field((type) => Number, { nullable: true })
  amount?: number;

  @Field((type) => String)
  email: string;

  @Field((type) => Number, { nullable: true })
  balanceBefore?: number;

  @Field((type) => Number, { nullable: true })
  balanceAfter?: number;

  @Field((type) => WalletTransactionStatus, { nullable: true })
  status?: WalletTransactionStatus;
  
  @Field((type) => WalletTransactionType, { nullable: true })
  paymentType?: WalletTransactionType;

  @Field((type) => Number, { nullable: true })
  createdAt?: number;

  @Field((type) => Number, { nullable: true })
  updatedAt?: number;
}

@InputType()
export class CreateWalletTransactionInput {
  @Field((type) => ID)
  userId: string;

  @Field((type) => ID)
  walletId: string;

  @Field((type) => String, { nullable: true })
  transactionId?: string;

  @Field((type) => ID, { nullable: true })
  vaultId?: string;

  @Field((type) => Number)
  amount: number;

  @Field((type) => String)
  email: string;
}

@InputType()
export class CommonWalletTransactionInput {
  @Field((type) => ID, { nullable: true })
  userId?: string;

  @Field((type) => ID, { nullable: true })
  walletId?: string;

  @Field((type) => String, { nullable: true })
  transactionId?: string;

  @Field((type) => ID, { nullable: true })
  vaultId?: string;

  @Field((type) => String, { nullable: true })
  authorization_url?: string;

  @Field((type) => String, { nullable: true })
  transfer_code?: string;

  @Field((type) => Number, { nullable: true })
  amount?: number;

  @Field((type) => String, { nullable: true })
  email?: string;

  @Field((type) => Number, { nullable: true })
  balanceBefore?: number;

  @Field((type) => Number, { nullable: true })
  balanceAfter?: number;

  @Field((type) => WalletTransactionStatus, { nullable: true })
  status?: WalletTransactionStatus;

  @Field((type) => WalletTransactionType, { nullable: true })
  paymentType?: WalletTransactionType;
}

@InputType()
export class UpdateWalletTransactionInput extends CommonWalletTransactionInput {}

@InputType()
export class WalletTransactionInput {
  @Field((type) => Number)
  amount: number;

  @Field((type) => ID)
  walletId: string;
  
  @Field((type) => ID, { nullable: true })
  vaultId?: string;

  @Field((type) => String)
  email: string;

}

@InputType()
export class QueryWalletTransactionInput extends CommonWalletTransactionInput {}

@InputType()
export class WalletTransactionPageInput {
  @Field((type) => Number, { nullable: false })
  skip: number;
  @Field((type) => Number, { nullable: false })
  take: number;
  @Field((type) => ID, { nullable: true })
  userId: string;
  @Field((type) => ID, { nullable: true })
  walletId: string;
  @Field((type) => String, { nullable: true })
  keyword: string;
}

@ObjectType()
export class WalletTransactionPageResult {
  @Field((type) => Number, { nullable: false })
  totalRecords: number;
  @Field((type) => [WalletTransaction])
  data: [WalletTransaction];
}

@ObjectType()
export class WalletTransactionSummary {
  @Field()
  totalCount: number;
  @Field()
  totalPending: number;
}
