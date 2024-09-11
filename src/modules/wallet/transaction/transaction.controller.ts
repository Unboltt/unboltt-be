import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { WalletTransactionService } from "./transaction.service";
import { PaymentService } from "src/modules/payment/payment.service";

@Controller("wallet")
export class WalletTransactionController {
  constructor(
    //private readonly paymentSvc: PaymentService,
  ) {}

  // @Get("paystack-payment")
  // async paystackCallback(
  //   @Res() res: Response,
  //   @Query("trxref") trxref: string
  // ): Promise<any> {

  //   const isTransactionVerified = await this.paymentSvc.verifyTransaction(trxref);
  //   if(isTransactionVerified){

  //   }else{
  //     res.statusCode = 400;
  //     return {"error": "Payment not verified"}
  //   }
  // }
}
