import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { MailService } from "src/modules/mail/mail.service";
import { AuthService } from "../auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService:AuthService, private readonly jwt:JwtService, private readonly mailService: MailService){
        super()
    }

    async validate(username:string, password:string):Promise<any>{
        const user = await this.authService.validateUser(username, password)
        if(!user){
            throw new UnauthorizedException()
        }else if(!user.isEmailConfirmed){
            const confirmation_token = await this.jwt.signAsync({email:user.email},{
                expiresIn:"15m",
                secret:process.env.CONFIRM_EMAIL_SECRET
            })
        
            const url = `${process.env.BASE_URL}/auth/confirm-email/${confirmation_token}`
            await this.mailService.sendConfirmEmail(url, user.username, user.email);
            throw new UnauthorizedException("Account Not Activated");
        }
        
        return user
    }


}