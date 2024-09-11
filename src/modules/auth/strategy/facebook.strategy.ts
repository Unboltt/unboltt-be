import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";

export class FacebookStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            clientID:process.env.FACEBOOK_APP_ID,
            clientSecret:process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL:process.env.FACEBOOK_CALLBACK_URL,
            scope:"email",
            profileFields:["email", "name", "displayName", "photos"],
        })
    }

    async validate(accessToken:string, refreshToken:string, profile:any, done:(err:any, user:any, info?:any)=>void):Promise<any>{
        const {name, emails, displayName, photos} = profile
        const user = {
            firstName:name.givenName,
            lastName:name.familyName,
            email:emails[0].value,
            username: displayName,
            avatar: photos[0].value,
            accessToken,
            refreshToken
        }
        done(null, user)
    }
}