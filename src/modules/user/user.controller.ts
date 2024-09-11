import {
  Controller, Get,
  HttpException,
  HttpStatus,
  Param
} from '@nestjs/common';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userSvc: UserService) {}

  @Get('retrieve-by-app/:id/:token')
  public async findOne(
    @Param('id') id: string,
    @Param('token') token: string,
  ): Promise<User> {
    if (token !== process.env.AP_ACCESS_TOKEN)
      throw new HttpException('Invalid access', HttpStatus.FORBIDDEN);
    const rs = await this.userSvc.findOne({ _id: id } as any);

    return {
      _id: rs._id,
      email: rs.email,
      username: rs.username,
      name: `${rs.firstName} ${rs.lastName}`,
      refresh_token: rs?.refreshToken
        ? rs?.refreshToken[rs.refreshToken?.length - 1]
        : '',
      roles: rs.roles,
    } as User;
  }
}
