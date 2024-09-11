import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { Types } from "mongoose";
import { PaymentService } from "./payment.service";
import { BankDetails, ResolveAccount, ResolveAccountInput } from "./payment.model";
import { UseGuards } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { GqlJwtGuard } from "../auth/guards/gql.jwt.guard";
import { Role } from "../auth/roles.enum";

@Resolver()
export class PaymentResolver{
    constructor(private paymentSvc: PaymentService){}

    @Query((returns) => [BankDetails], { name: "getBankList" })
    // @UseGuards(GqlJwtGuard)
    // @Roles(Role.USER)
    public async getBankList() {
      return this.paymentSvc.getBankList();
    }

    @Query((returns) => Boolean, { name: "verifyTransaction" })
    @UseGuards(GqlJwtGuard)
    @Roles(Role.USER)
    public async verifyTransaction(@Args("ref") ref: string) {
      return this.paymentSvc.verifyTransaction(ref);
    }

    @Query((returns) => ResolveAccount, { name: "resolveBankAccount" })
    // @UseGuards(GqlJwtGuard)
    // @Roles(Role.USER)
    public async resolveAccount(@Args("resolve") resolve: ResolveAccountInput) {
      return this.paymentSvc.resolveAccount(resolve);
    }

}