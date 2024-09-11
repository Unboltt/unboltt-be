import { Module, forwardRef } from "@nestjs/common";
import { FileUploadService } from "./upload.service";
import { FileUploadResolver } from "./upload.resolver";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { ImagekitModule } from "./imagekit/imagekit.module";

@Module({
    imports:[CloudinaryModule, ImagekitModule],
    providers:[FileUploadService, FileUploadResolver],
    exports:[FileUploadService]
})
export class FileUploadModule{}