import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User, QueryUserInput, UserPageResult, UserPageInput, UserSummary, AccountDetailsInput } from './user.model';
import { UserService } from './user.service';

import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { GqlJwtGuard } from '../auth/guards/gql.jwt.guard';
import { GqlCurrentUser } from '../auth/decorators/gql.user.decorator';


@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userSvc: UserService) {}

  @Query((returns) => UserSummary, { name: 'userSummary' })
  public async summary(
    @Args('query') query: QueryUserInput,
  ): Promise<UserSummary> {
    const promise = await Promise.all([
      await this.userSvc.count({
        ...query,
      } as any),
    ]);

    return {
      totalCount: promise[0],
    };
  }
  
  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  @Mutation((returns) => Boolean, { name: 'updateUser' })
  public async update(
    @Args('user') user: QueryUserInput,
    @GqlCurrentUser() userID:any,
  ): Promise<boolean> {
    await this.userSvc.update(userID.sub, user as any);
    return true;
  }

  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  @Mutation((returns) => Boolean, { name: 'updateBankAccount' })
  public async updateBankAccount(
    @Args('account') account: AccountDetailsInput,
    @GqlCurrentUser() userID:any,
  ): Promise<boolean> {
    await this.userSvc.updateBankAccount(userID.sub, account);
    return true;
  }

  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  @Query((returns) => User, { name: 'findOneUser' })
  public async findOne(@GqlCurrentUser() user:any): Promise<User> {
    return this.userSvc.findOne({_id:user.sub} as any) as any;
  }

  @Query((returns) => [User], { name: 'findUsers' })
  public async find(@Args('query') query: QueryUserInput): Promise<User[]> {
    return this.userSvc.find(query as any) as any;
  }

  @Query((returns) => UserPageResult, { name: 'userPage' })
  public async page(
    @GqlCurrentUser() user: any,
    @Args('user_query') user_query: QueryUserInput,
    @Args('page') page: UserPageInput,
  ) {
    return this.userSvc.page(user_query as any, page as any);
  }



}
