import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GqlLocalGuard extends AuthGuard("local"){
    constructor(){
        super()
    }

    getRequest(context:ExecutionContext){
        const graphqlContext = GqlExecutionContext.create(context);
        const request = graphqlContext.getContext();
        request.body = graphqlContext.getArgs().user;
        return request;
    }
}