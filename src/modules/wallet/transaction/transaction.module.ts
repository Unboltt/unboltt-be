import { MongooseModule } from "@nestjs/mongoose";
import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "src/modules/auth/auth.module";
import {
  WalletTransaction,
  WalletTransactionSchema,
} from "./transaction.schema";
import { WalletTransactionService } from "./transaction.service";
import { WalletTransactionRepository } from "./transaction.repository";
import {
  WalletTransactionResolver,
} from "./transaction.resolver";
import { UserModule } from "src/modules/user/user.module";
import { WalletModule } from "../wallet.module";
import { WalletTransactionController } from "./transaction.controller";
import { PaymentModule } from "src/modules/payment/payment.module";
import { MailModule } from "src/modules/mail/mail.module";
import { VaultModule } from "src/modules/vault/vault.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => WalletModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => MailModule),
    forwardRef(() => VaultModule),

  ],
  controllers: [WalletTransactionController],
  providers: [
    WalletTransactionService,
    WalletTransactionRepository,
    WalletTransactionResolver,
  ],
  exports: [WalletTransactionService, WalletTransactionRepository],
})
export class WalletTransactionModule {}
