import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:process.env.GOOGLE_CALLBACK_URL,
            scope:['email', 'profile']
        })
    }
    async validate(accessToken:string, refreshToken:string, profile:any, done:VerifyCallback):Promise<any>{
        const {name, emails, photos, displayName} = profile
        const user = {
            email:emails[0].value,
            username:displayName,
            firstName:name.givenName,
            lastName: name.familyName,
            avatar: photos[0].value,
            accessToken,
            refreshToken
        }
        done(null, user)
    }
}