import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.respository';
import { AccountDetails, PageParams, PageResult, User } from './user.schema';
import { Types } from 'mongoose';
import { PaymentService } from '../payment/payment.service';
import { TransactionCurrency, TransferRecipentType } from '../payment/payment.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly paymentService: PaymentService,
  ) {}

  public create(user: User): Promise<User> {
    return this.userRepo.create(user);
  }

  public async update(_id: string, user: Partial<User>): Promise<void> {
    this.userRepo.update(_id, user);
  }

  public async findOne(user: Partial<User>): Promise<User> {
    return this.userRepo.findOne(user);
  }

  public async findOneAuth(user: Partial<User>): Promise<User> {
    return this.userRepo.findOneAuth(user);
  }

  public async find(user: Partial<User>): Promise<User[]> {
    return this.userRepo.find(user);
  }

  public async delete(_id: string): Promise<void> {
    await this.userRepo.delete(_id);
  }

  public async page(query: Partial<User>, page: PageParams): Promise<PageResult<User>> {
    return this.userRepo.page(query, page);
  }

  public async count(query: Partial<User>){
    return this.userRepo.count(query);
  }

  public async updateBankAccount(userId:string, account: AccountDetails): Promise<void>{
    let user = await this.userRepo.findOne({_id: new Types.ObjectId(userId)});
    if(!user){
      throw new ForbiddenException("User not found, can't update bank account");
    }
    
    const { recipient_code } = await this.paymentService.createTranferRecipient({
      account_number: account.number,
      bank_code: account.code,
      name: account.name,
      currency: TransactionCurrency.NIGERIAN_NAIRA,
      type: TransferRecipentType.NUBAN
    });

    await this.userRepo.update(userId, {account_details: {...account, recipient_code}});
  }
}
