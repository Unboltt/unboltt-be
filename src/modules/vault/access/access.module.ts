import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VaultAccessService } from "./access.service";
import { VaultAccessRepository } from "./access.repository";
import { VaultAccess, VaultAccessSchema } from "./access.schema";
import { VaultAccessResolver } from "./access.resolver";
import { VaultAccessController } from "./access.controller";
import { VaultModule } from "../vault.module";
import { WalletTransactionModule } from "src/modules/wallet/transaction/transaction.module";

@Module({
    imports:[
        MongooseModule.forFeature([{ name: VaultAccess.name, schema: VaultAccessSchema }]),
        forwardRef(()=>VaultModule),
        forwardRef(()=>WalletTransactionModule)
    ],
    providers:[VaultAccessRepository, VaultAccessService, VaultAccessResolver],
    exports:[VaultAccessRepository, VaultAccessService],
    controllers:[VaultAccessController]
})
export class VaultAccessModule{}