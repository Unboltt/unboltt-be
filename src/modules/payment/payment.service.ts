import { Injectable } from "@nestjs/common";
import { PaystackClientService } from "./paystack/paystack.service";
import { IBankDetails, IInitailzeTransacton, IResolveAccount, IResolveAccountInput, ITransactionData, ITransfer, ITransferInput, ITransferRecipient, ITransferRecipientInput } from "./payment.interface";

@Injectable()
export class PaymentService{
    constructor(private paystackClientService: PaystackClientService){}

    public generateTransactionRef(): string{
        return "ubltt_" + Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    public async createTransaction(transaction: IInitailzeTransacton): Promise<ITransactionData> {
        return this.paystackClientService.createTransaction(transaction);
    }

    public async verifyTransaction(ref:string): Promise<boolean> {
        return this.paystackClientService.verifyTransaction(ref);
    }

    public async resolveAccount(account: IResolveAccountInput): Promise<IResolveAccount> {
        return this.paystackClientService.resolveAccount(account);
    }

    public async getBankList(): Promise<IBankDetails[]>{
        return this.paystackClientService.getBankList();
    }

    public async createTranferRecipient(recipient: ITransferRecipientInput): Promise<ITransferRecipient>{
        return this.paystackClientService.createTranferRecipient(recipient);
    }

    public async initiateTransfer(transfer: ITransferInput): Promise <ITransfer>{
        return this.paystackClientService.initiateTransfer(transfer);
    }

}