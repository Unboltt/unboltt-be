import { Prop } from "@nestjs/mongoose"
import { CloudinaryFileUploadType, ImagekitFileUploadType } from "./upload.interface";
import { Types } from "mongoose";

export class CloudinaryFileUploadObject{
    _id?: Types.ObjectId;

    @Prop({required:false})
    public_id?: string;

    @Prop({required:false})
    format?: string;

    @Prop({enum: CloudinaryFileUploadType, required:false})
    resource_type?: CloudinaryFileUploadType;

    @Prop({required:false})
    bytes?: number;

    @Prop({required:true})
    url: string;

    @Prop({required:true})
    secure_url: string;
}

export class ImagekitVersionInfo{
    @Prop({required:false})
    id?: string;
    @Prop({required:false})
    name?: string;
}

export class ImagekitMetadata{
    @Prop({required:false})
    height?: number;

    @Prop({required:false})
    width?: number;

    @Prop({required:false})
    bitRate?: number;

    @Prop({required:false})
    duration?: number;

    @Prop({required:false})
    audioCodec?: string;

    @Prop({required:false})
    ideoCodec?: string;

    @Prop({required:false})
    size?: number;
}

export class ImagekitFileUploadObject{
    @Prop({required:false})
    fileId?: string;

    @Prop({required:false})
    name?: string;

    @Prop({required:false})
    size?: number;

    @Prop({required:false})
    versionInfo?: ImagekitVersionInfo;

    @Prop({required:false})
    filePath?: string;

    @Prop({required:false})
    url?: string;

    @Prop({required:false})
    signed_url?: string;

    @Prop({required:false})
    preview_signed_url?: string;

    @Prop({enum: ImagekitFileUploadType, required:false})
    fileType?: ImagekitFileUploadType;

    @Prop({required:false})
    height?: number;

    @Prop({required:false})
    width?: number;

    @Prop({required:false})
    orientation?: number;

    @Prop({required:false})
    thumbnailUrl?: string;

    @Prop({required:false})
    bitRate?: number;

    @Prop({required:false})
    duration?: number;

    @Prop({required:false})
    audioCodec?: string;

    @Prop({required:false})
    videoCodec?: string;

    @Prop({required:false})
    metadata?: ImagekitMetadata;

    @Prop({required:false})
    isPrivateFile?: boolean;

    @Prop({required:false})
    folder?: string;
}

export class ImagekitUploadObject{
    _id?: Types.ObjectId;
    
    @Prop()
    file?: ImagekitFileUploadObject;

    @Prop()
    thumbnail?: ImagekitFileUploadObject;
}