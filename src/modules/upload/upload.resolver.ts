import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CloudinaryFileUploadObject, ImagekitConfigInput, UploadFileInput } from "./upload.model";
import { FileUploadService } from "./upload.service";
import { Types } from "mongoose";

@Resolver()
export class FileUploadResolver{
    constructor(private uploadSvc:FileUploadService){}

    @Mutation(()=> Boolean, {name: "uploadFileCloudinary"})
    public async uploadFileCloudinary(@Args("upload") upload: UploadFileInput){
        await this.uploadSvc.uploadFileCloudinary(upload.upload);
        return true;
    }

    @Mutation(()=> Boolean, {name: "uploadFileImagekit"})
    public async uploadFileImagekit(@Args("upload") upload: UploadFileInput, @Args("config") config: ImagekitConfigInput){
        await this.uploadSvc.uploadFileImagekit(upload.upload, config);
        return true;
    }

    @Mutation(()=> [CloudinaryFileUploadObject], {name: "uploadFilesCloudinary"})
    public async uploadFilesCloudinary(@Args("upload") upload: UploadFileInput){
        if(upload.uploads.length > 0){
            let filePayload = [] as any;
            filePayload = await this.uploadSvc.uploadFilesCloudinary(upload.uploads);
            for(let file in filePayload){
                filePayload[file]._id = new Types.ObjectId();
                console.log(filePayload[file], "here");
            }
            upload.uploads = filePayload;
          }
        return upload.uploads;
    }
}