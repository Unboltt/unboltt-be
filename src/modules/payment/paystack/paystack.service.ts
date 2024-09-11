import { Injectable } from "@nestjs/common";
import {Paystack} from 'paystack-sdk';
import { IBankDetails, IInitailzeTransacton, IResolveAccount, IResolveAccountInput, ITransactionData, ITransfer, ITransferInput, ITransferRecipient, ITransferRecipientInput, TransactionStatus } from "../payment.interface";
import * as fetch from "node-fetch";

@Injectable()
export class PaystackClientService{
    private paystack: Paystack;
    constructor(){
        this.paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);
    }

    public async createTransaction(transaction: IInitailzeTransacton): Promise<ITransactionData> {
        const trans = await this.paystack.transaction.initialize(transaction);
        return trans.data;
    }

    public async verifyTransaction(ref:string): Promise<boolean> {
        const trans = await this.paystack.transaction.verify(ref);
        if(trans?.data?.status === TransactionStatus.SUCCESS){
            return true;
        }else{
            return false;
        }
    }

    public async resolveAccount(account: IResolveAccountInput): Promise<IResolveAccount> {
        const resolveAcc = await this.paystack.verification.resolveAccount(account);
        console.log(resolveAcc);
        return resolveAcc.data;
    }

    public async getBankList(): Promise<IBankDetails[]>{
        const fetchBanks = await fetch("https://api.paystack.co/bank", {
            headers:{
                "authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            },
            method: "GET"
        });

        const banks = await fetchBanks.json();
        return banks.data;
    }

    public async createTranferRecipient(recipient: ITransferRecipientInput): Promise<ITransferRecipient>{
        const createRecipient = await fetch("https://api.paystack.co/transferrecipient", {
            headers:{
                "authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            },
            method: "POST",
            body:JSON.stringify(recipient)
        });

        const trfRecipient = await createRecipient.json();
        return {
            recipient_code: trfRecipient.data.recipient_code
        };
    }

    public async initiateTransfer(transfer: ITransferInput): Promise <ITransfer>{
        const initTransfer = await this.paystack.transfer.initiate(transfer) as any;
        return initTransfer.data;
    }

}