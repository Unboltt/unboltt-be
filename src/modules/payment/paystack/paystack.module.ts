import { Module } from "@nestjs/common";
import { PaystackClientService } from "./paystack.service";

@Module({
    providers:[PaystackClientService],
    exports:[PaystackClientService]
})
export class PaystackClientModule{}