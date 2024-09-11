import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import {
  CreateVaultInput,
  QueryVaultInput,
  UpdateVaultInput,
  Vault,
  VaultPageInput,
  VaultPageResult,
  VaultSummary,
} from './vault.model';
import { VaultService } from './vault.service';
import { GqlCurrentUser } from '../auth/decorators/gql.user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlJwtGuard } from '../auth/guards/gql.jwt.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';

@Resolver((of) => Vault)
export class VaultResolver {
  constructor(private vaultSvc: VaultService) {}

  @Query((returns) => VaultSummary, { name: 'vaultSummary' })
  public async summary(
    @Args('query') query: QueryVaultInput,
  ): Promise<VaultSummary> {
    const promise = await Promise.all([
      await this.vaultSvc.count({
        ...query,
      } as any),
    ]);

    return {
      totalCount: promise[0],
    };
  }

  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  @Mutation((returns) => Vault, { name: 'createVault' })
  public async create(
    @GqlCurrentUser() user: any,
    @Args('vault') vault: CreateVaultInput,
  ) {
    vault.userId = user.sub;
    return this.vaultSvc.create(vault as any);
  }

  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  @Mutation((returns) => Vault, { name: 'updateVault' })
  public async update(
    @GqlCurrentUser() user: any,
    @Args('id') _id: string,
    @Args('vault') vault: UpdateVaultInput,
  ) {
    const payload: any = { ...vault }
    return this.vaultSvc.update(_id, payload as any);
  }

  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  @Mutation((returns) => Boolean, { name: 'deleteVault' })
  public async delete(@GqlCurrentUser() user: any, @Args('id') id: string) {
    return this.vaultSvc.delete(id);
  }

  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  @Query((returns) => Vault, { name: 'findVault' })
  public async findOne(
    @GqlCurrentUser() user: any,
    @Args('vault') vault: QueryVaultInput,
  ) {
    return this.vaultSvc.findOne(vault as any);
  }

  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  @Query((returns) => Vault, { name: 'findVaultById' })
  public async findById(@GqlCurrentUser() user: any, @Args('id') id: string) {
    return this.vaultSvc.findOne({ _id: id } as any);
  }

  @Query((returns) => [Vault], { name: 'findVaults' })
  public async find(@Args('vault') vault: QueryVaultInput) {
    return this.vaultSvc.find(vault as unknown);
  }

  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  @Query((returns) => VaultPageResult, { name: 'vaultPage' })
  public async page(
    @GqlCurrentUser() user: any,
    @Args('vault') vault: QueryVaultInput,
    @Args('page') page: VaultPageInput,
  ) {
    return this.vaultSvc.page(vault as any, page as any);
  }

  @UseGuards(GqlJwtGuard)
  @Roles(Role.USER)
  @Mutation((returns) => Boolean, { name: 'deleteVaultFile' })
  public async deleteFile(
    @Args('vaultId') vaultId: string,
    @Args('fileId') fileId: string,
  ) {
    return await this.vaultSvc.deleteFile(vaultId, fileId);
  }
}
