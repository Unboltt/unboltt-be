import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Vault, VaultSchema } from "./vault.schema";
import { VaultRepository } from "./vault.repository";
import { VaultService } from "./vault.service";
import { VaultResolver } from "./vault.resolver";
import { FileUploadModule } from "../upload/upload.module";
import { UserModule } from "../user/user.module";
import { MailModule } from "../mail/mail.module";
import { VaultAccessModule } from "./access/access.module";

@Module({
    imports:[
        MongooseModule.forFeature([{ name: Vault.name, schema: VaultSchema }]),
        forwardRef(()=>FileUploadModule),
        forwardRef(()=>UserModule),
        forwardRef(()=>MailModule),
        forwardRef(()=>VaultAccessModule)
    ],
    providers:[VaultRepository, VaultService, VaultResolver],
    exports:[VaultRepository, VaultService]
})
export class VaultModule{}