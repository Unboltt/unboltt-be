import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { WalletService } from "./wallet.service";
import { UserService } from "../user/user.service";
import {
  CreateWalletInput,
  QueryWalletInput,
  UpdateWalletInput,
  Wallet,
} from "./wallet.dto";
import { User } from "../user/user.model";
import { types } from "util";
import { Types } from "mongoose";
import { GqlJwtGuard } from "../auth/guards/gql.jwt.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/roles.enum";
import { GqlCurrentUser } from "../auth/decorators/gql.user.decorator";

@Resolver((of) => Wallet)
export class WalletResolver {
  constructor(
    private readonly userSvc: UserService,
    private readonly walletSvc: WalletService
  ) {}

  @ResolveField(returns => User)
  async user(@Parent() args:Wallet):Promise<any>{
    return this.walletSvc.finduser(args.userId);
  }

  @Mutation((returns) => Wallet, { name: "createWallet" })
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  public async create(
    @GqlCurrentUser() user: any,
    @Args("wallet") wallet: CreateWalletInput
  ) {
    return this.walletSvc.create({
      ...wallet,
      createdBy: user._id,
    } as any);
  }

  @Mutation((returns) => Wallet, { name: "updateWallet" })
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  public async update(
    @Args("id") id: string,
    @Args("wallet") wallet: UpdateWalletInput
  ) {
    return this.walletSvc.update(id, {
      ...wallet,
    } as any);
  }

  @Mutation((returns) => Boolean, { name: "deleteWallet" })
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  public async delete(@Args("query") query: QueryWalletInput) {
    return this.walletSvc.delete(query as any);
  }

  // @Mutation((returns) => Boolean, { name: "deleteWallet" })
  // @GqlAuthorize([UserRoleTypes.SuperAdmin, UserRoleTypes.Customer])
  // public async delete(@Args("id") id: string) {
  //   return this.walletSvc.delete(id);
  // }

  @Query((returns) => [Wallet], { name: "findWallet" })
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  public async find(@Args("query") query: QueryWalletInput) {
    return this.walletSvc.find(query as any);
  }

  @Query((returns) => Wallet, { name: "findWalletById" })
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  public async findOne(@Args("id") id: string) {
    return this.walletSvc.findById(id);
  }
}
