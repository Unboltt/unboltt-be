export interface IInitailzeTransacton{
    amount: string,
    email: string,
    transaction_charge?: number,
    currency: TransactionCurrency,
    reference: string,
    callback_url?: string,
    subaccount?: string
}

export enum TransactionCurrency{
    NIGERIAN_NAIRA = "NGN",
    US_DOLLARS = "USD"
}

export interface ITransactionData {
    authorization_url: string,
    access_code: string,
    reference: string
}

export interface IResolveAccountInput {
    account_number: string,
    bank_code: string
}

export interface IResolveAccount {
    account_number: string,
    account_name: string,
    bank_id?: number,
    bank_code?: string
}

export enum TransactionStatus {
    ABANDONED = "abandoned",
    FAILED = "failed",
    ONGOING = "ongoing",
    PENDING = "pending",
    REVERSED = "reversed",
    SUCCESS = "success"
}

export interface IBankDetails {
    id: number,
    name: string,
    slug: string,
    code: string,
    longcode: string,
    gateway: string,
    pay_with_bank: boolean,
    supports_transfer: boolean,
    active: boolean,
    country: string,
    currency: string,
    type: string,
    is_deleted: boolean,
    createdAt: string,
    updatedAt: string
}

export interface ITransferRecipientInput{
    type: TransferRecipentType,
    name: string,
    account_number: string,
    bank_code: string,
    currency: TransactionCurrency
}

export interface ITransferRecipient{
    recipient_code: string
}

export enum TransferRecipentType{
    NUBAN = "nuban"
}

export interface ITransferInput{
    source: TransferFrom,
    amount: number,
    reference: string,
    recipient: string,
    reason: TransferReason
}

export enum TransferFrom{
    BALANCE = "balance"
}

export enum TransferReason{
    WALLET_WITHDRAWAL = "Wallet Withdrawal"
}

export interface ITransfer{
    reference: string,
    amount: number,
    currency: TransactionCurrency,
    source: TransferFrom,
    reason: TransferReason,
    recipient: number,
    status: TransactionStatus,
    transfer_code: string,
    id: number,
    createdAt: string,
}

export enum PaystackWebhookEvents{
    TRANSFER_SUCCESS = "transfer.success",
    TRANSFER_FAILED = "transfer.failed",
    TRANSFER_REVERSED = "transfer.reversed",
    CHARGE_SUCCESS = "charge.success"
}