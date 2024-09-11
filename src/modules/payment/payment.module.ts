import { Module, forwardRef } from "@nestjs/common";
import { PaymentResolver } from "./payment.resolver";
import { PaymentService } from "./payment.service";
import { PaystackClientModule } from "./paystack/paystack.module";
import { PaymentController } from "./payment.controller";
import { WalletTransactionModule } from "../wallet/transaction/transaction.module";
import { VaultModule } from "../vault/vault.module";

@Module({
    imports:[
        PaystackClientModule, 
        forwardRef(() => WalletTransactionModule), 
        forwardRef(() => VaultModule), 
    ],
    providers:[PaymentService, PaymentResolver],
    exports:[PaymentService],
    controllers:[PaymentController]
})
export class PaymentModule{}