import { Injectable } from "@nestjs/common";
import { CloudinaryFileUploadType, ICloudinaryUploadResponse, IImagekitMultiUpload, IImagekitTransforms, IImagekitUploadConfig, IImagekitUploadResponse } from "./upload.interface";
import { CloudinaryService } from "./cloudinary/cloudinary.service";
import { ImagekitService } from "./imagekit/imagekit.service";
import { ImagekitUploadObject } from "./upload.model";
import { NoUndefinedVariablesRule } from "graphql";

@Injectable()
export class FileUploadService{
    constructor(
        private cloudinaryService: CloudinaryService,
        private imagekitService: ImagekitService
    ){}

    public async uploadFileCloudinary(file: any):Promise<ICloudinaryUploadResponse>{
        return this.cloudinaryService.uploadFile(file);
    }

    public async uploadFileImagekit(file: any, config: IImagekitUploadConfig):Promise<IImagekitUploadResponse>{
        return this.imagekitService.uploadFile(file, config);
    }

    public async uploadFilesCloudinary(files: any[]):Promise<ICloudinaryUploadResponse[]>{
        let uploadedFiles:ICloudinaryUploadResponse[] = [];
        for(let file in files){
            uploadedFiles.push(await this.cloudinaryService.uploadFile(files[file]));
        }
        return uploadedFiles;
    }

    public async uploadFilesImagekit(multiupload: IImagekitMultiUpload[]):Promise<ImagekitUploadObject[]>{
        let uploadedFiles:ImagekitUploadObject[] = [];
        console.log(multiupload);
        for(let file in multiupload){
            uploadedFiles.push({
                file: await this.imagekitService.uploadFile(multiupload[file].file, {...multiupload[file].config}),
                thumbnail: multiupload[file].thumbnail ? await this.imagekitService.uploadFile(multiupload[file].thumbnail, {...multiupload[file].config}) : {}
            });
        }
        return uploadedFiles;
    }

    public async deleteFileCloudinary(public_id: string, resource_type: CloudinaryFileUploadType): Promise<boolean>{
        return this.cloudinaryService.deleteFile(public_id, resource_type);
    }

    public async deleteFileImagekit(file_id: string): Promise<boolean>{
        return this.imagekitService.deleteFile(file_id);
    }

    public async bulkDeleteFilesImagekit(file_ids: string[]): Promise<boolean>{
        return this.imagekitService.bulkDeleteFiles(file_ids);
    }

    public async getFileUrlImagekit(filePath: string, signed: boolean, transforms: IImagekitTransforms): Promise<string>{
        return this.imagekitService.getFileUrl(filePath, signed, transforms);
    }

}