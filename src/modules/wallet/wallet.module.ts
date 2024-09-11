import { MongooseModule } from "@nestjs/mongoose";
import { WalletResolver } from "./wallet.resolver";
import { WalletService } from "./wallet.service";
import { Module, forwardRef } from "@nestjs/common";
import { Wallet, WalletSchema } from "./wallet.schema";
import { WalletRepository } from "./wallet.repository";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { WalletTransactionModule } from "./transaction/transaction.module";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => WalletTransactionModule),
  ],
  controllers: [],
  providers: [WalletService, WalletRepository, WalletResolver],
  exports:[WalletService, WalletRepository]
})
export class WalletModule {}
