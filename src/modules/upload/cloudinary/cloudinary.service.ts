import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { FileUploadFolders, CloudinaryFileUploadType, ICloudinaryUploadConfig, IFileStream, ICloudinaryUploadResponse } from "../upload.interface";

@Injectable()
export class CloudinaryService{
    constructor(){
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        });
    }

    public async uploadFile(file: Promise<IFileStream>):Promise<ICloudinaryUploadResponse>{
        const uploadedFile: IFileStream = await file;
        const uploadedFileStream = await uploadedFile.createReadStream();
        
        let config: ICloudinaryUploadConfig = {
            resource_type: "auto"
        }

        if(uploadedFile.mimetype.includes(CloudinaryFileUploadType.IMAGE)){
            config.folder = FileUploadFolders.IMAGES
        }else if(uploadedFile.mimetype.includes(CloudinaryFileUploadType.VIDEO)){
            config.folder = FileUploadFolders.VIDEOS
        }else{
            config.folder = FileUploadFolders.FILES
        }
        
        const uploadRes:Promise<ICloudinaryUploadResponse> = new Promise((resolve, reject)=>{
            const upload = cloudinary.uploader.upload_stream({...config as any}, (err, callResult)=>{
                if(err){
                    reject(err.message);
                }else{
                    const {bytes, format, public_id, resource_type, secure_url, url} = callResult;
                    resolve({
                        bytes,
                        format,
                        public_id,
                        resource_type: resource_type as any,
                        secure_url,
                        url
                    });
                }
            });
            uploadedFileStream.pipe(upload);
        });

        return uploadRes;
    }

    public async deleteFile(public_id: string, resource_type: CloudinaryFileUploadType):Promise<boolean>{
        await cloudinary.api.delete_resources([public_id], { type: 'upload', resource_type});
        return true;
    }

}