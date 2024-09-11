import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { User as UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';
import {
  LoginResponse,
  Tokens,
  UserChangePassword,
  UserSignIn,
  UserSignUp,
} from './auth.model';
import * as argon from 'argon2';
import { Response, Request } from 'express';
import { Types } from 'mongoose';
import { MailService } from '../mail/mail.service';
import * as uiavatars from 'ui-avatars';
import JwtPayload from './JwtPayload.interface';
import { WalletService } from '../wallet/wallet.service';
import { CloudinaryFileUploadType } from '../upload/upload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    private jwt: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserSchema> {
    const checkUser = await this.userService.findOneAuth({
      username: username,
      email: username,
    });
    if (!checkUser) {
      throw new ForbiddenException('Invalid Username Or Password');
    }

    if (await argon.verify(checkUser.password, password)) {
      delete checkUser.password;
      return checkUser;
    } else {
      throw new ForbiddenException('Invalid Username Or Password');
    }
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: JwtPayload = this.jwt.verify(token, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });

    const userId = payload.sub;

    if (userId) {
      return this.userService.findOne({
        _id: new Types.ObjectId(userId),
      });
    }
  }

  async signup(user: UserSignUp): Promise<UserSchema> {
    const checkUser = await this.userService.findOneAuth({
      username: user.username,
      email: user.email,
    });
    if (checkUser) {
      throw new ForbiddenException('User Already Exists');
    }

    const avatarUrl = uiavatars.generateAvatar({
      uppercase: true,
      name: `${user.firstName}+${user.lastName}`,
      //background: "990000",
      //color: "000000",
      fontsize: 0.5,
      bold: true,
      length: 2,
      size: 512,
    });

    user.password = await argon.hash(user.password);
    const newUser = await this.userService.create({
      ...user,
      avatar: {
        _id: new Types.ObjectId(),
        secure_url: avatarUrl,
        url: avatarUrl,
        resource_type: CloudinaryFileUploadType.IMAGE
      }
    } as any);

    const newWallet = await this.walletService.create({
      userId: newUser._id,
    });
    await this.userService.update(newUser._id.toString(), {
      walletID: newWallet._id
    });
    newUser.walletID = newWallet._id;

    const confirmation_token = await this.jwt.signAsync(
      { email: user.email },
      {
        expiresIn: '15m',
        secret: process.env.CONFIRM_EMAIL_SECRET,
      },
    );

    const url = `${process.env.BASE_URL}/auth/confirm-email/${confirmation_token}`;

    this.mailService.sendConfirmEmail(url, user.username, user.email);
    return newUser;
  }

  async signin(
    user: UserSignIn,
    req: Request,
    res: Response,
  ): Promise<LoginResponse> {
    const headers = req.headers;
    const checkUser = await this.userService.findOneAuth({
      username: user.username,
      email: user.username,
    });

    if(checkUser){
      if (!checkUser.isRegComplete) {
        throw new ForbiddenException('Registration not Completed');
      } else if (!checkUser.isEmailConfirmed) {
        throw new ForbiddenException('Email not Confirmed');
      }
    }else{
      throw new ForbiddenException('User does not Exist');
    }

    const token = await this.genJwtToken(checkUser);
    // const access_token = await this.jwt.signAsync({user:checkUser.username, sub:checkUser._id, roles:checkUser.roles}, {
    //     expiresIn: "15m",
    //     secret: process.env.ACCESS_TOKEN_SECRET
    // })

    // const refresh_token = await this.jwt.signAsync({user:checkUser.username, sub:checkUser._id, roles:checkUser.roles}, {
    //     expiresIn: "7d",
    //     secret: process.env.REFRESH_TOKEN_SECRET
    // })

    if (headers.refresh_token) {
      const oldRefreshToken = req.headers.refresh_token;
      const newRefreshTokenArray = checkUser.refreshToken.filter(
        (rt) => rt !== oldRefreshToken,
      );
      await this.userService.update(checkUser._id.toString(), {
        refreshToken: [...newRefreshTokenArray, token.refresh_token],
      });
    } else {
      await this.userService.update(checkUser._id.toString(), {
        refreshToken: [...checkUser.refreshToken, token.refresh_token],
      });
    }

    // res.cookie('refresh_token', token.refresh_token, {
    //   httpOnly: true,
    //   sameSite: 'none',
    //   secure: true,
    //   maxAge: 60 * 60 * 24 * 7,
    // });

    return {
      ...token,
      details: {
        _id: checkUser._id.toString(),
        roles: checkUser.roles,
        name: `${checkUser.firstName} ${checkUser.lastName}`,
      },
    }
  }

  async signout(req: Request, res: Response): Promise<void> {
    //delete access token and refresh token from client

    //delete refresh token from db
    const headers = req.headers;
    if (!headers?.refresh_token) {
      throw new UnauthorizedException();
    }
    const oldRefreshToken = req.headers.refresh_token;

    const user = await this.userService.findOne({
      refreshToken: oldRefreshToken as any,
    });
    if (!user) {
      // res.clearCookie('refresh_token', {
      //   httpOnly: true,
      //   sameSite: 'none',
      //   secure: true,
      // });
      throw new ForbiddenException();
    }

    const newRefreshTokenArray = user.refreshToken.filter(
      (rt) => rt !== oldRefreshToken,
    );
    await this.userService.update(user._id.toString(), {
      refreshToken: [...newRefreshTokenArray],
    });
    //clear cookie
    // res.clearCookie('refresh_token', {
    //   httpOnly: true,
    //   sameSite: 'none',
    //   secure: true,
    // });
  }

  async changePassword(
    id: string,
    resetData: UserChangePassword,
  ): Promise<void> {
    const user = await this.userService.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!user) {
      throw new ForbiddenException('Invalid User');
    }

    if (await argon.verify(user.password, resetData.oldPassword)) {
      const hashPassword = await argon.hash(resetData.newPassword);
      return await this.userService.update(id, { password: hashPassword });
    } else {
      throw new ForbiddenException('Current Password is Invalid');
    }
  }

  async deleteAccount(id: string): Promise<void> {
    //TODO: Implement soft delete
    const user = await this.userService.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!user) {
      throw new ForbiddenException('Invalid User');
    }

    await this.userService.delete(id);
  }

  async refresh(req: Request, res: Response): Promise<Tokens> {
    const headers = req.headers;
    if (!headers.refresh_token) {
      throw new UnauthorizedException();
    }
    const oldRefreshToken = req.headers.refresh_token;
    // res.clearCookie('refresh_token', {
    //   httpOnly: true,
    //   sameSite: 'none',
    //   secure: true,
    // });

    const user = await this.userService.findOne({
      refreshToken: oldRefreshToken as any,
    });

    //reuse detection
    if (!user) {
      const token = await this.jwt
        .verifyAsync(oldRefreshToken as any, {
          secret: process.env.REFRESH_TOKEN_SECRET,
        })
        .catch(() => {
          throw new ForbiddenException();
        });
      const invalidUser = await this.userService.findOneAuth({
        username: token.user,
        email: token.user,
      });

      if (!invalidUser) {
        throw new ForbiddenException();
      }
      await this.userService.update(invalidUser._id.toString(), {
        refreshToken: [],
      });
      throw new ForbiddenException();
    }

    const newRefreshTokenArray = user.refreshToken.filter(
      (rt) => rt !== oldRefreshToken,
    );

    //evaluate refresh token
    const decode = await this.jwt
      .verifyAsync(oldRefreshToken as any, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      })
      .catch((error) => {
        if (error || user._id !== decode.sub) {
          this.userService.update(user._id.toString(), {
            refreshToken: [...newRefreshTokenArray],
          });
          throw new UnauthorizedException();
        }
      });

    //everything checks out, send access and refresh token again

    const access_token = await this.jwt.signAsync(
      { user: user.username, sub: user._id, roles: user.roles },
      {
        expiresIn: '15m',
        secret: process.env.ACCESS_TOKEN_SECRET,
      },
    );
    const refresh_token = await this.jwt.signAsync(
      { user: user.username, sub: user._id, roles: user.roles },
      {
        expiresIn: '7d',
        secret: process.env.REFRESH_TOKEN_SECRET,
      },
    );
    await this.userService.update(user._id.toString(), {
      refreshToken: [...newRefreshTokenArray, refresh_token],
    });
    // res.cookie('refresh_token', refresh_token, {
    //   httpOnly: true,
    //   sameSite: 'none',
    //   secure: true,
    //   maxAge: 60 * 60 * 24 * 7,
    // });
    return { access_token, refresh_token };
  }

  async googleAuth(req, res): Promise<any> {
    const headers = req.headers;
    if (!req.user) {
      throw new ForbiddenException('No User from Google');
    }
    const { email, firstName, lastName, username, avatar } = req.user;
    const checkUser = await this.userService.findOne({ email });
    if (checkUser) {
      //issue new access and refresh token
      const access_token = await this.jwt.signAsync(
        {
          user: checkUser.username,
          sub: checkUser._id,
          roles: checkUser.roles,
        },
        {
          expiresIn: '15m',
          secret: process.env.ACCESS_TOKEN_SECRET,
        },
      );

      const refresh_token = await this.jwt.signAsync(
        {
          user: checkUser.username,
          sub: checkUser._id,
          roles: checkUser.roles,
        },
        {
          expiresIn: '7d',
          secret: process.env.REFRESH_TOKEN_SECRET,
        },
      );

      if (headers.refresh_token) {
        const oldRefreshToken = req.headers.refresh_token;
        const newRefreshTokenArray = checkUser.refreshToken.filter(
          (rt) => rt !== oldRefreshToken,
        );
        await this.userService.update(checkUser._id.toString(), {
          refreshToken: [...newRefreshTokenArray, refresh_token],
        });
      } else {
        await this.userService.update(checkUser._id.toString(), {
          refreshToken: [...checkUser.refreshToken, refresh_token],
        });
      }

      // res.cookie('refresh_token', refresh_token, {
      //   httpOnly: true,
      //   sameSite: 'none',
      //   secure: true,
      //   maxAge: 60 * 60 * 24 * 7,
      // });

      return { access_token, refresh_token };
    }

    //sign up user
    const userData = {
      email,
      firstName,
      lastName,
      username,
    };
    const newUser = await this.userService.create({
      ...userData,
      isEmailConfirmed: true,
      avatar: {
        _id: new Types.ObjectId(),
        secure_url: avatar,
        url: avatar,
        resource_type: CloudinaryFileUploadType.IMAGE
      }
    } as any);
    const newWallet = await this.walletService.create({
      userId: newUser._id,
    });
    await this.userService.update(newUser._id.toString(), {
      walletID: newWallet._id
    });
    newUser.walletID = newWallet._id;
    return newUser;
  }

  async facebookAuth(req, res): Promise<any> {
    const headers = req.headers;
    if (!req.user) {
      throw new ForbiddenException('No User from Facebook');
    }
    const { email, firstName, lastName, username, avatar } = req.user;
    const checkUser = await this.userService.findOne({ email });
    if (checkUser) {
      //issue new access and refresh token
      const access_token = await this.jwt.signAsync(
        {
          user: checkUser.username,
          sub: checkUser._id,
          roles: checkUser.roles,
        },
        {
          expiresIn: '15m',
          secret: process.env.ACCESS_TOKEN_SECRET,
        },
      );

      const refresh_token = await this.jwt.signAsync(
        {
          user: checkUser.username,
          sub: checkUser._id,
          roles: checkUser.roles,
        },
        {
          expiresIn: '7d',
          secret: process.env.REFRESH_TOKEN_SECRET,
        },
      );

      if (headers.refresh_token) {
        const oldRefreshToken = req.headers.refresh_token;
        const newRefreshTokenArray = checkUser.refreshToken.filter(
          (rt) => rt !== oldRefreshToken,
        );
        await this.userService.update(checkUser._id.toString(), {
          refreshToken: [...newRefreshTokenArray, refresh_token],
        });
      } else {
        await this.userService.update(checkUser._id.toString(), {
          refreshToken: [...checkUser.refreshToken, refresh_token],
        });
      }

      // res.cookie('refresh_token', refresh_token, {
      //   httpOnly: true,
      //   sameSite: 'none',
      //   secure: true,
      //   maxAge: 60 * 60 * 24 * 7,
      // });

      return { access_token, refresh_token };
    }

    //sign up user
    const userData = {
      email,
      firstName,
      lastName,
      username,
    };
    const newUser = await this.userService.create({
      ...userData,
      avatar: {
        _id: new Types.ObjectId(),
        secure_url: avatar,
        url: avatar,
        resource_type: CloudinaryFileUploadType.IMAGE
      }
    } as any);
    const newWallet = await this.walletService.create({
      userId: newUser._id,
    });
    await this.userService.update(newUser._id.toString(), {
      walletID: newWallet._id
    });
    newUser.walletID = newWallet._id;
    
    return newUser;
  }

  async confirmEmail(token: string): Promise<any> {
    const decode = await this.jwt
      .verifyAsync(token, {
        secret: process.env.CONFIRM_EMAIL_SECRET,
      })
      .catch(() => {
        throw new ForbiddenException('Invalid Token');
      });

    const user = await this.userService.findOne({ email: decode.email });

    if (!user) {
      throw new ForbiddenException('Invalid User');
    } else if (user.isEmailConfirmed) {
      throw new ForbiddenException('Email Already Activated');
    }

    await this.userService
      .update(user._id.toString(), { isEmailConfirmed: true })
      .then(() => {
        this.mailService.sendWelcomeEmail(process.env.FE_URL, user.username, user.email);
        return user.isEmailConfirmed;
      })
      .catch(() => {
        throw new ForbiddenException('Could not activate email');
      });
  }

  async generateResetLink(email: string): Promise<any> {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new ForbiddenException('Invalid User');
    }

    const secret = process.env.RESET_PASSWORD_SECRET + user.password;

    const token = await this.jwt.signAsync(
      { email: user.email, sub: user._id },
      {
        expiresIn: '15m',
        secret,
      },
    );

    const url = `${process.env.BASE_URL}/auth/reset/${user._id}/${token}`;

    this.mailService.sendResetPasswordEmail(url, user.username, user.email);
  }

  async resetPassword(
    id: string,
    token: string,
    newPassword: string,
  ): Promise<any> {
    const user = await this.userService.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!user) {
      throw new ForbiddenException('Invalid User');
    }

    this.jwt
      .verifyAsync(token, {
        secret: process.env.RESET_PASSWORD_SECRET + user.password,
      })
      .catch(() => {
        throw new ForbiddenException('Invalid Token');
      });

    const newHashPassword = await argon.hash(newPassword);

    return this.userService.update(user._id.toString(), {
      password: newHashPassword,
    });
  }

  async genJwtToken(
    user: UserSchema,
  ): Promise<{ access_token: string; refresh_token: string }> {

    const access_token = await this.jwt.signAsync(
      {
        user: user.username,
        sub: user._id,
        roles: user.roles,
      },
      {
        expiresIn: '15m',
        secret: process.env.ACCESS_TOKEN_SECRET,
      },
    );

    const refresh_token = await this.jwt.signAsync(
      {
        user: user.username,
        sub: user._id,
        roles: user.roles,
      },
      {
        expiresIn: '7d',
        secret: process.env.REFRESH_TOKEN_SECRET,
      },
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
