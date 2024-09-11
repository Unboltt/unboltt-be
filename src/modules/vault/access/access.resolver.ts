import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CreateVaultAccessInput, QueryVaultAccessInput, UpdateVaultAccessInput, VaultAccess, VaultAccessPageInput, VaultAccessPageResult, VaultAccessSummary } from './access.model';
import { VaultAccessService } from './access.service';

@Resolver((of) => VaultAccess)
export class VaultAccessResolver {
  constructor(private vaultSvc: VaultAccessService) {}

  @Query((returns) => VaultAccessSummary, { name: 'vaultAccessSummary' })
  public async summary(
    @Args('query') query: QueryVaultAccessInput,
  ): Promise<VaultAccessSummary> {
    const promise = await Promise.all([
      await this.vaultSvc.count({
        ...query,
      } as any),
    ]);

    return {
      totalCount: promise[0],
    };
  }

  @Mutation((returns) => VaultAccess, { name: 'createVaultAccess' })
  public async create(
    @Args('vault') vault: CreateVaultAccessInput,
  ) {
    return this.vaultSvc.create(vault as any);
  }

  @Mutation((returns) => VaultAccess, { name: 'updateVaultAccess' })
  public async update(
    @Args('id') _id: string,
    @Args('vault') vault: UpdateVaultAccessInput,
  ) {
    return this.vaultSvc.update(_id, vault as any);
  }

  @Mutation((returns) => Boolean, { name: 'deleteVaultAccess' })
  public async delete(@Args('id') id: string) {
    return this.vaultSvc.delete(id);
  }

  @Query((returns) => VaultAccess, { name: 'findVault' })
  public async findOne(
    @Args('vault') vault: QueryVaultAccessInput,
  ) {
    return this.vaultSvc.findOne(vault as any);
  }

  @Query((returns) => VaultAccess, { name: 'findVaultAccessById' })
  public async findById(@Args('id') id: string) {
    return this.vaultSvc.findOne({ _id: id } as any);
  }

  @Query((returns) => [VaultAccess], { name: 'findManyVaultAccess' })
  public async find(@Args('vault') vault: QueryVaultAccessInput) {
    return this.vaultSvc.find(vault as any);
  }

  @Query((returns) => VaultAccessPageResult, { name: 'vaultAccessPage' })
  public async page(
    @Args('vault') vault: QueryVaultAccessInput,
    @Args('page') page: VaultAccessPageInput,
  ) {
    return this.vaultSvc.page(vault as any, page as any);
  }
}
