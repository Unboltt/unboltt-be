import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response, Request } from 'express';
import { User } from '../user/user.model';
import { LoginResponse, Tokens, UserChangePassword, UserSignIn, UserSignUp } from './auth.model';
import { AuthService } from './auth.service';
import { GqlCurrentUser } from './decorators/gql.user.decorator';
import { Roles } from './decorators/roles.decorator';
import { GqlJwtGuard } from './guards/gql.jwt.guard';
import { GqlLocalGuard } from './guards/gql.local.guard';
import { Role } from './roles.enum';


@Resolver()
export class AuthResolver {
    constructor(private readonly authService:AuthService){}

    @Mutation(returns => User, {name: "userSignUp"})
    async signup(@Args("user") signupDetails:UserSignUp):Promise<any>{
        return this.authService.signup(signupDetails)
    }

    @Mutation(returns => LoginResponse, {name: "userSignIn"})
    @UseGuards(GqlLocalGuard)
    async signin(@Args("user") loginDetails:UserSignIn, @Context("req") req:Request, @Context("res") res:Response):Promise<LoginResponse>{
        return this.authService.signin(loginDetails, req, res);
    }

    @Mutation(returns => Boolean, {name:"userSignOut"})
    @UseGuards(GqlJwtGuard)
    @Roles(Role.USER)
    async signout(@Context("req") req:Request, @Context("res") res:Response){
        await this.authService.signout(req, res);
        return true;
    }

    @Mutation(returns => Boolean, {name:"userChangePassword"})
    @UseGuards(GqlJwtGuard)
    @Roles(Role.USER)
    async change(@GqlCurrentUser() user:any, @Args("resetData") resetData:UserChangePassword): Promise<boolean>{
        await this.authService.changePassword(user.sub, resetData);
        return true;
    }

    
    @Query((returns) => Boolean, { name: "deleteUser" })
    @UseGuards(GqlJwtGuard)
    @Roles(Role.USER)
    async delete(@GqlCurrentUser() user:any): Promise<boolean> {
        await this.authService.deleteAccount(user.sub);
        return true;
    }

    @Mutation((returns) => Tokens, { name: "getNewTokens" })
    async refresh(@Context("req") req:Request, @Context("res") res:Response):Promise<Tokens>{
        return await this.authService.refresh(req, res);
    }

    @Mutation((returns) => Boolean, { name: "userResetPassword" })
    async reset(@Args("email") email:string):Promise<boolean>{
        await this.authService.generateResetLink(email);
        return true;
    }
}
