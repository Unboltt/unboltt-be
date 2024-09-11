import { Injectable } from "@nestjs/common";
import { IFileStream, IImagekitTransforms, IImagekitUploadConfig, IImagekitUploadResponse } from "../upload.interface";
import { streamToBase64, toBase64String } from "src/common/streamToBase64";
const ImageKit = require("imagekit");

@Injectable()
export class ImagekitService{
    private imagekit_api;
    constructor(){
        this.imagekit_api = new ImageKit({
            publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey : process.env.IMAGEKIT_PRIVATE_KEY, 
            urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT,
        });
    }

    public async uploadFile(file: Promise<IFileStream>, config?: IImagekitUploadConfig):Promise<IImagekitUploadResponse>{
        const uploadedFile: IFileStream = await file;
        const uploadedFileStream = await uploadedFile.createReadStream();
        
        const uploadRes: IImagekitUploadResponse = await this.imagekit_api.upload({
            file : uploadedFileStream,
            fileName : uploadedFile.filename,
            ...config
        }).then(async response => {
            console.log(response);
            console.log(await this.getFileUrl(response.filePath, true, {}));
            return response;
        }).catch(error => {
            console.log(error);
        });

        return uploadRes;
    }

    public async deleteFile(file_id: string):Promise<boolean>{
        await this.imagekit_api.deleteFile(file_id).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
        return true;
    }

    public async bulkDeleteFiles(file_ids: string[]):Promise<boolean>{
        await this.imagekit_api.bulkDeleteFiles(file_ids).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
        return true;
    }

    public async getFileUrl(filePath: string, signed: boolean, transforms: IImagekitTransforms): Promise<string>{
        return this.imagekit_api.url({
            path : filePath,
            transformation : [{...transforms}],
            signed,
        });
    }

}