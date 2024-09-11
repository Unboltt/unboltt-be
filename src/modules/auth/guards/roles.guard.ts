import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GetContext } from "../get.user.context";
import { Role } from "../roles.enum";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector:Reflector, private getctx:GetContext){}

    async canActivate(context: ExecutionContext):Promise<boolean>{
        const user = context.switchToHttp().getRequest().user;
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()])
        if(!requiredRoles){
            return true
        }
        return requiredRoles.some((role)=>user?.roles?.includes(role));
    }
}       