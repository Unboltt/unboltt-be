import { Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class GetContext {
    constructor(private jwt: JwtService) { }
    async getUser(gqlContext: GqlExecutionContext): Promise<any> {
        const context = gqlContext.getContext();
        const req = context ? context.req : null;
        if (req && req.headers.authorization) {
            const splitToken = req.headers.authorization.split(" ");
            return this.jwt.verifyAsync(splitToken[1], {
                secret: process.env.ACCESS_TOKEN_SECRET,
            }).catch((err) => {
                throw new UnauthorizedException();
            });
        }
        return null;
    }


    // async getUser(gqlContext:GqlExecutionContext):Promise<any>{
    //     const token = gqlContext.getContext().req.headers.authorization
    //     if(token){
    //         const splitToken = token.split(" ")
    //         return this.jwt.verifyAsync(splitToken[1], {
    //             secret: process.env.ACCESS_TOKEN_SECRET
    //         }).catch(err=>{throw new UnauthorizedException()})
    //     }
    //     return
    // }
}