import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { createHmac } from 'crypto';
import { PaystackClientService } from './paystack/paystack.service';
import { PaystackWebhookEvents } from './payment.interface';
import { PaymentService } from './payment.service';
import { WalletService } from '../wallet/wallet.service';
import { Response } from 'express';
import { VaultService } from '../vault/vault.service';
import { WalletTransactionService } from '../wallet/transaction/transaction.service';


@Controller("payment")
export class PaymentController {
  constructor(
    private paystackClientService: PaystackClientService,
    private paymentSvc: PaymentService,
    private transactionSvc: WalletTransactionService,
    private vaultSvc: VaultService
  ) {}

  @Post("paystack/webhook")
  handlePaystackEvent(@Body() payload, @Req() req: Request, @Res() res: Response) {
    const hash = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
    if (hash === req.headers['x-paystack-signature']) {
      const event = req.body;
      // if(event === PaystackWebhookEvents.CHARGE_SUCCESS){
      //   // Do something with event 
      // }
      return res.sendStatus(200);
    }else{
      return res.sendStatus(400);
    }
  }

  @Get("paystack/callback")
  async handlePaystackEventCallback(@Res() res: Response, @Query("trxref") trxref: string) {
    const isTransactionVerified = await this.paymentSvc.verifyTransaction(trxref);
    console.log(isTransactionVerified);
    if(isTransactionVerified){
      const isWalletUpdated = await this.transactionSvc.updateWalletWithPayment(trxref);
      if(isWalletUpdated){
        const transaction = await this.transactionSvc.findOne({transactionId: trxref});
        await this.vaultSvc.accessVault(transaction.transactionId, transaction.email, transaction.vaultId.toString());
      }
      //TODO:redirect user to payment success page, check email on FE
      return res.sendStatus(200);
    }else {
      return res.sendStatus(400);
    }
  }
}