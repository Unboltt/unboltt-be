import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { WalletTransactionRepository } from "./transaction.repository";
import {
  PageParams,
  PageResult,
  WalletTransaction,
} from "./transaction.schema";
import { WalletService } from "../wallet.service";
import { UserService } from "src/modules/user/user.service";
import { WalletTransactionStatus, WalletTransactionType } from "./transaction.enum";
import { PaymentService } from "src/modules/payment/payment.service";
import { TransactionCurrency, TransactionStatus, TransferFrom, TransferReason } from "src/modules/payment/payment.interface";
import { MailService } from "src/modules/mail/mail.service";
import { currencyFormatter } from "src/common/formatCurrency";
import { VaultService } from "src/modules/vault/vault.service";

@Injectable()
export class WalletTransactionService {
  constructor(
    private readonly walletTransactionRepo: WalletTransactionRepository,
    private readonly walletSvc: WalletService,
    private readonly userSvc: UserService,
    private readonly paymentSvc: PaymentService,
    private readonly mailSvc: MailService,
    @Inject(forwardRef(()=>VaultService))
    private readonly vaultSvc: VaultService,
  ) {}

  public async create(model: WalletTransaction): Promise<WalletTransaction> {
    return this.walletTransactionRepo.create(model);
  }

  public async update(
    id: string,
    model: Partial<WalletTransaction>
  ): Promise<WalletTransaction> {
    const transaction = await this.walletTransactionRepo.findById(id);
    if (!transaction) throw new Error("Transaction not found");

    return this.walletTransactionRepo.update(id, model);
  }

  public async delete(model: Partial<WalletTransaction>): Promise<Boolean> {
    await this.walletTransactionRepo.delete(model);
    return true;
  }

  //   public async delete(id: string): Promise<Boolean> {
  //     await this.walletTransactionRepo.delete(id);
  //     return true;
  //   }

  public async findById(id: string): Promise<WalletTransaction> {
    return this.findOne({ _id: id } as any);
  }

  public async find(
    query: Partial<WalletTransaction>
  ): Promise<WalletTransaction[]> {
    return this.walletTransactionRepo.find(query);
  }

  public async findOne(
    query: Partial<WalletTransaction>
  ): Promise<WalletTransaction> {
    return this.walletTransactionRepo.findOne(query);
  }

  public async walletPayment(model: Partial<WalletTransaction>): Promise<WalletTransaction>{
    let transaction: WalletTransaction;
    const wallet = await this.walletSvc.findById(model.walletId.toString());
    if(!wallet)
     throw new HttpException("Wallet not found", HttpStatus.NOT_FOUND);

    //Initiate transation
    transaction = await this.walletTransactionRepo.create({
      ...model,
      userId: wallet.userId,
      paymentType: WalletTransactionType.PAYMENT,
      transactionId: this.generateWalletTransactionId(wallet._id.toString()),
    } as any);

    //Complete payment
    const payment = await this.paymentSvc.createTransaction({
      amount: (model.amount * 100).toString(),
      currency: TransactionCurrency.NIGERIAN_NAIRA,
      email: model.email,
      reference: transaction.transactionId,
      callback_url: process.env.PAYSTACK_CALLBACK_URL
    });

    transaction = await this.walletTransactionRepo.update(transaction._id.toString(), {
      authorization_url: payment.authorization_url
    });

    return transaction;
  }

  public async walletWithdraw(model: Partial<WalletTransaction>): Promise<WalletTransaction>{
    let transaction: WalletTransaction;
    const wallet = await this.walletSvc.findById(model.walletId.toString());
    if(!wallet)
     throw new HttpException("Wallet not found", HttpStatus.NOT_FOUND);

    if (wallet.balance < model.amount)
     throw new HttpException("Wallet balance too low for this transaction", HttpStatus.FORBIDDEN);

    const user = await this.userSvc.findOne({_id: wallet.userId});
    //Initiate transation
    transaction = await this.walletTransactionRepo.create({
      ...model,
      paymentType: WalletTransactionType.WITHDRAW,
      transactionId: this.generateWalletTransactionId(wallet._id.toString()),
    } as any);

    //payouts will be manual until, we're approved by paystack
    if(process.env.PAYSTACK_TRANSFER_ENABLED){
      const payment = await this.paymentSvc.initiateTransfer({
        amount: model.amount * 100,
        reason: TransferReason.WALLET_WITHDRAWAL,
        recipient: user.account_details.recipient_code,
        reference: transaction.transactionId,
        source: TransferFrom.BALANCE
      });
  
      await this.walletTransactionRepo.update(transaction._id.toString(), {
        transfer_code: payment.transfer_code
      });
    }


    return transaction;
  }

  async updateWalletWithPayment(transactionId: string):Promise <boolean>{
    const transaction = await this.findOne({transactionId});
    if(!transaction)
      throw new HttpException("Transaction not found", HttpStatus.NOT_FOUND);

    if(transaction.status === WalletTransactionStatus.PENDING){
      const wallet = await this.walletSvc.findById(transaction.walletId.toString());
      if(!wallet)
        throw new HttpException("Wallet not found", HttpStatus.NOT_FOUND);
  
      const user = await this.userSvc.findOne({_id: wallet.userId});
      if(!user)
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
  
      const vault = await this.vaultSvc.findOne({_id: transaction.vaultId});
      if(!vault)
        throw new HttpException("Vault not found", HttpStatus.NOT_FOUND);
  
      //Update wallet
      await this.walletSvc.update(wallet._id.toString(), {
        balance: this.walletSvc.formatBalance(wallet.balance + transaction.amount),
        total_amount_topup: this.walletSvc.formatBalance(wallet.total_amount_topup + transaction.amount)
      });
  
      //Complete transation
      await this.walletTransactionRepo.update(transaction._id.toString(), {
        status: WalletTransactionStatus.PAID,
        balanceBefore: this.walletSvc.formatBalance(wallet.balance),
        balanceAfter: this.walletSvc.formatBalance(wallet.balance + transaction.amount)
      });
  
      this.mailSvc.sendPaymentEmail(currencyFormatter(transaction.amount), vault.name, user.username, user.email);
    }
    
    return true;
  }

  async updateWalletWithWithdrawal(transactionId: string):Promise <boolean>{
    const transaction = await this.findOne({transactionId});
    if(!transaction)
      throw new HttpException("Transaction not found", HttpStatus.NOT_FOUND);

    if(transaction.status === WalletTransactionStatus.PENDING){
      const wallet = await this.walletSvc.findById(transaction.walletId.toString());
      if(!wallet)
        throw new HttpException("Wallet not found", HttpStatus.NOT_FOUND);

      const user = await this.userSvc.findOne({_id: wallet.userId});
      if(!user)
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);

      //Update wallet
      await this.walletSvc.update(wallet._id.toString(), {
        balance: this.walletSvc.formatBalance(wallet.balance - transaction.amount),
      });

      //Complete transation
      await this.walletTransactionRepo.update(transaction._id.toString(), {
        status: WalletTransactionStatus.PAID,
        balanceBefore: this.walletSvc.formatBalance(wallet.balance),
        balanceAfter: this.walletSvc.formatBalance(wallet.balance - transaction.amount)
      });

      this.mailSvc.sendWithdrawalEmail(currencyFormatter(transaction.amount), user.username, user.email);
    }

    return true;
  }

  async approveWithdrawalAdmin(transactionId: string):Promise <boolean>{
    const transaction = await this.findOne({transactionId});
    if(!transaction)
      throw new HttpException("Transaction not found", HttpStatus.NOT_FOUND);

    if(transaction.status === WalletTransactionStatus.PENDING){
      const wallet = await this.walletSvc.findById(transaction.walletId.toString());
      if(!wallet)
        throw new HttpException("Wallet not found", HttpStatus.NOT_FOUND);
  
      const user = await this.userSvc.findOne({_id: wallet.userId});
      if(!user)
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
  
      //Update wallet
      await this.walletSvc.update(wallet._id.toString(), {
        balance: this.walletSvc.formatBalance(wallet.balance - transaction.amount),
      });
  
      //Complete transation
      await this.walletTransactionRepo.update(transaction._id.toString(), {
        status: WalletTransactionStatus.PAID,
        balanceBefore: this.walletSvc.formatBalance(wallet.balance),
        balanceAfter: this.walletSvc.formatBalance(wallet.balance - transaction.amount)
      });
  
      this.mailSvc.sendWithdrawalEmail(currencyFormatter(transaction.amount), user.username, user.email);
    }

    return true;
  }

  seed = async (): Promise<void> => {
    await this.walletTransactionRepo.seed();
  }

  async page(project: Partial<WalletTransaction>, page: PageParams): Promise<PageResult<WalletTransaction>>{
    return this.walletTransactionRepo.page(project, page);
  }

  public async count(query: Partial<WalletTransaction>) {
    return this.walletTransactionRepo.count(query);
  }

  public generateWalletTransactionId(id: string): string {
    id = id.substring(id.length - 5);
    return `ubltt_${id + Date.now().toString(36) + Math.random().toString(36).substring(2)}`;
  }
}
