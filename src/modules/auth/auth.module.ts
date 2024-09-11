import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { GetContext } from './get.user.context';
import { GoogleStrategy } from './strategy/google.strategy';
import { AuthController } from './auth.controller';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports:[
    PassportModule, 
    JwtModule.register({}),
    forwardRef(()=>UserModule), 
    forwardRef(()=>WalletModule)
  ],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy, GoogleStrategy, FacebookStrategy , GetContext],
  controllers:[AuthController],
  exports: [GetContext, AuthService]
})
export class AuthModule {}
