import { Module, forwardRef } from "@nestjs/common";
import { ImagekitService } from "./imagekit.service";

@Module({
    imports:[],
    providers:[ImagekitService],
    exports:[ImagekitService]
})
export class ImagekitModule{}