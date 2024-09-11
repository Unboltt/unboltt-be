import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";
import { Request, Response } from "express";
import { LoginResponse, UserSignIn, UserSignUp } from "./auth.model";
import { AuthService } from "./auth.service";
import { Roles } from "./decorators/roles.decorator";
import { FacebookGuard } from "./guards/facebook.guard";
import { GoogleGuard } from "./guards/google.guard";
import { JwtGuard } from "./guards/jwt.guard";
import { LocalGuard } from "./guards/local.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Role } from "./roles.enum";


@Controller("auth")
export class AuthController{
    constructor(private readonly authService: AuthService) {}


    @Get("/google")
    @UseGuards(GoogleGuard)
    async googleAuth(@Req() req:Request):Promise<any>{
    }

    @Get("/google/callback")
    @UseGuards(GoogleGuard)
    async googleAuthRedirect(@Req() req:Request, @Res({passthrough:true}) res:Response):Promise<any>{
        return this.authService.googleAuth(req, res);
    }

    @Get("/facebook")
    @UseGuards(FacebookGuard)
    async facebookAuth(@Req() req:Request):Promise<any>{
    }

    @Get("/facebook/callback")
    @UseGuards(FacebookGuard)
    async facebookAuthRedirect(@Req() req:Request, @Res({passthrough:true}) res:Response):Promise<any>{
        return this.authService.facebookAuth(req, res);
    }

    @HttpCode(HttpStatus.OK)
    @Get("/confirm-email/:token")
    async confirmEmail(@Param("token") getToken:any):Promise<any>{
        return this.authService.confirmEmail(getToken)
    }

    @Post("/reset/:id/:token")
    async resetPasswordGet(@Param("id") id:any, @Param("token") token:any, @Body("newPassword") newPassword:string):Promise<any>{
        return this.authService.resetPassword(id, token, newPassword)
    }

    @Post("/signup")
    async signup(@Body() signupDetails:UserSignUp):Promise<any>{
        return this.authService.signup(signupDetails)
    }

    @Post("/signin")
    @UseGuards(LocalGuard)
    async signin(@Body() loginDetails:UserSignIn, @Req() req:Request, @Res({passthrough:true}) res:Response):Promise<LoginResponse>{
        return this.authService.signin(loginDetails, req, res)
    }

    @Post("/signout")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.USER)
    async signout(@Req() req:Request, @Res({passthrough:true}) res:Response):Promise<any>{
        await this.authService.signout(req, res)
        return true;
    }
}