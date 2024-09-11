import { Field, ID, InputType, ObjectType, registerEnumType } from "@nestjs/graphql"
import { PaystackWebhookEvents, TransactionCurrency, TransactionStatus, TransferFrom, TransferReason, TransferRecipentType } from "./payment.interface"

registerEnumType(TransactionCurrency, {
    name: "TransactionCurrency"
});

registerEnumType(TransactionStatus, {
    name: "TransactionStatus"
});

registerEnumType(TransferRecipentType, {
    name: "TransferRecipentType"
});

registerEnumType(TransferFrom, {
    name: "TransferFrom"
});

registerEnumType(TransferReason, {
    name: "TransferReason"
});

registerEnumType(PaystackWebhookEvents, {
    name: "PaystackWebhookEvents"
});

@ObjectType()
export class BankDetails {
    @Field((type) => ID, {nullable:true})
    id: number
    @Field({nullable:true})
    name: string
    @Field({nullable:true})
    slug: string
    @Field({nullable:true})
    code: string
    @Field({nullable:true})
    longcode: string
    @Field({nullable:true})
    gateway: string
    @Field({nullable:true})
    pay_with_bank: boolean
    @Field({nullable:true})
    supports_transfer: boolean
    @Field({nullable:true})
    active: boolean
    @Field({nullable:true})
    country: string
    @Field({nullable:true})
    currency: string
    @Field({nullable:true})
    type: string
    @Field({nullable:true})
    is_deleted: boolean
    @Field({nullable:true})
    createdAt: string
    @Field({nullable:true})
    updatedAt: string
}

@ObjectType()
export class ResolveAccount {
    @Field()
    account_number: string
    @Field()
    account_name: string
    @Field({nullable:true})
    bank_id?: number
    @Field({nullable:true})
    bank_code?: string
}

@InputType()
export class ResolveAccountInput {
    @Field()
    account_number: string
    @Field()
    bank_code: string
}