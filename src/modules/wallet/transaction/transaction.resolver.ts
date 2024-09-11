import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { WalletTransactionService } from "./transaction.service";
import {
  CreateWalletTransactionInput,
  QueryWalletTransactionInput,
  UpdateWalletTransactionInput,
  WalletTransaction,
  WalletTransactionInput,
  WalletTransactionPageInput,
  WalletTransactionPageResult,
  WalletTransactionSummary,
} from "./transaction.dto";

import { WalletService } from "../wallet.service";
import { Wallet } from "../wallet.dto";
import { WalletTransactionStatus } from "./transaction.enum";
import { UserService } from "src/modules/user/user.service";
import { Types } from "mongoose";
import { GqlCurrentUser } from "src/modules/auth/decorators/gql.user.decorator";
import { User } from "src/modules/user/user.model";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { GqlJwtGuard } from "src/modules/auth/guards/gql.jwt.guard";
import { Role } from "src/modules/auth/roles.enum";

@Resolver((of)=> WalletTransaction)
export class WalletTransactionResolver {
  constructor(
    private readonly userSvc: UserService,
    private readonly walletSvc: WalletService,
    private readonly walletTransactionSvc: WalletTransactionService
  ) {}

  @ResolveField(returns => User)
  async user(@Parent() args:WalletTransaction):Promise<any>{
    return this.walletSvc.finduser(args.userId);
  }

  // @ResolveField(returns => Profile)
  // async profile(@Parent() args:WalletTransaction):Promise<any>{
  //   return this.walletSvc.findProfile(args.userId);
  // }

  @ResolveField((returns) => Wallet)
  public async wallet(@Parent() args: WalletTransaction) {
    return this.walletSvc.findById(args.walletId);
  }

  @Mutation((returns) => WalletTransaction, { name: "createWalletTransaction" })
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  public async create(
    @GqlCurrentUser() user: any,
    @Args("wallet") wallet: CreateWalletTransactionInput
  ) {
    return this.walletTransactionSvc.create({
      ...wallet,
      createdBy: user._id,
    } as any);
  }

  @Mutation((returns) => WalletTransaction, { name: "updateWalletTransaction" })
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  public async update(
    @Args("id") id: string,
    @Args("wallet") wallet: UpdateWalletTransactionInput
  ) {
    return this.walletTransactionSvc.update(id, {
      ...wallet,
    } as any);
  }

  @Mutation((returns) => Boolean, { name: "deleteWalletTransaction" })
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  public async delete(@Args("query") query: QueryWalletTransactionInput) {
    return this.walletTransactionSvc.delete(query as any);
  }

  // @Mutation((returns) => Boolean, { name: "deleteWallet" })
  // @GqlAuthorize([UserRoleTypes.SuperAdmin, UserRoleTypes.Customer])
  // public async delete(@Args("id") id: string) {
  //   return this.walletTransactionSvc.delete(id);
  // }

  @Query((returns) => [WalletTransaction], { name: "findWalletTransaction" })
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  public async find(@Args("query") query: QueryWalletTransactionInput) {
    return this.walletTransactionSvc.find(query as any);
  }

  @Query((returns) => WalletTransaction, { name: "findWalletTransactionById" })
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  public async findOne(@Args("id") id: string) {
    return this.walletTransactionSvc.findById(id);
  }

  @Mutation((returns) => WalletTransaction, { name: "walletPayment" })
  // @UseGuards(GqlJwtGuard)
  // @Roles(Role.USER)
  public async walletPayment(
    @Args("transaction") transaction: WalletTransactionInput,
    //@GqlCurrentUser() user: any
  ) {
    return this.walletTransactionSvc.walletPayment({
      ...transaction
    } as any );
  }

  @Mutation((returns) => WalletTransaction, { name: "walletWithdraw" })
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  public async walletWithdraw(
    @Args("transaction") transaction: WalletTransactionInput,
    @GqlCurrentUser() user: any
  ) {
    return this.walletTransactionSvc.walletWithdraw({
      ...transaction,
      userId: user?.sub,
    } as any );
  }

  @Mutation((returns) => WalletTransaction, { name: "approveWithdrawalAdmin" })
  public async walletWithdrawAdmin(
    @Args("transactionID") transactionID: string,
  ) {
    return this.walletTransactionSvc.approveWithdrawalAdmin(transactionID);
  }

  @Query((returns) => WalletTransactionPageResult, { name: 'walletTransactionPage' })
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  public async page(@Args('query') query: WalletTransactionInput, @Args("page") page: WalletTransactionPageInput) {
    return this.walletTransactionSvc.page(query as any, page);
  }
}
