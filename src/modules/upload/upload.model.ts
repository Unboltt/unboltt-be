import { Field, ID, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
import { CloudinaryFileUploadType, ImagekitFileUploadType } from "./upload.interface";

registerEnumType(CloudinaryFileUploadType, {
    name:"CloudinaryFileUploadType"
});

registerEnumType(ImagekitFileUploadType, {
    name:"ImagekitFileUploadType"
});

@ObjectType()
export class CloudinaryFileUploadObject{
    @Field((type) => ID, {nullable: true})
    _id?: string;

    @Field({nullable: true})
    public_id?: string;

    @Field({nullable: true})
    format?: string;

    @Field((type) => CloudinaryFileUploadType, {nullable: true})
    resource_type?: CloudinaryFileUploadType;

    @Field({nullable: true})
    bytes?: number;

    @Field({})
    url: string;

    @Field({})
    secure_url: string;
}

@InputType()
export class UploadFileInput{
    @Field((type) => GraphQLUpload, { nullable: true })
    upload?: FileUpload;

    @Field((type) => [GraphQLUpload], { nullable: true })
    uploads?: FileUpload[];
}

@InputType()
export class ImagekitConfigInput{
    @Field({ nullable: true })
    isPrivateFile?: boolean;

    @Field({ nullable: true })
    folder?: string;
}

@ObjectType()
export class ImagekitVersionInfo{
    @Field({ nullable: true })
    id?: string;

    @Field({ nullable: true })
    name?: string;
}

@ObjectType()
export class ImagekitMetadata{
    @Field({ nullable: true })
    height?: number;

    @Field({ nullable: true })
    width?: number;

    @Field({ nullable: true })
    bitRate?: number;

    @Field({ nullable: true })
    duration?: number;

    @Field({ nullable: true })
    audioCodec?: string;

    @Field({ nullable: true })
    ideoCodec?: string;

    @Field({ nullable: true })
    size?: number;
}

@ObjectType()
export class ImagekitFileUploadObject{
    @Field((type) => ID, {nullable: true})
    _id?: string;

    @Field({ nullable: true })
    fileId?: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    size?: number;

    @Field({ nullable: true })
    versionInfo?: ImagekitVersionInfo;

    @Field({ nullable: true })
    filePath?: string;

    @Field({ nullable: true })
    url?: string;

    @Field({ nullable: true })
    signed_url?: string;

    @Field({ nullable: true })
    preview_signed_url?: string;

    @Field((type) => ImagekitFileUploadType, {nullable: true})
    fileType?: ImagekitFileUploadType;

    @Field({ nullable: true })
    height?: number;

    @Field({ nullable: true })
    width?: number;

    @Field({ nullable: true })
    orientation?: number;

    @Field({ nullable: true })
    thumbnailUrl?: string;

    @Field({ nullable: true })
    bitRate?: number;

    @Field({ nullable: true })
    duration?: number;

    @Field({ nullable: true })
    audioCodec?: string;

    @Field({ nullable: true })
    videoCodec?: string;

    @Field({ nullable: true })
    metadata?: ImagekitMetadata;

    @Field({ nullable: true })
    isPrivateFile?: boolean;

    @Field({ nullable: true })
    folder?: string;
}

@InputType()
export class ImagekitUpload{
    @Field((type) => GraphQLUpload, { nullable: true })
    file?: FileUpload;

    @Field((type) => GraphQLUpload, { nullable: true })
    thumbnail?: FileUpload;
}

@InputType()
export class ImagekitUploadFileInput{
    @Field((type) => [ImagekitUpload], { nullable: true })
    files?: ImagekitUpload; 
}

@ObjectType()
export class ImagekitUploadObject{
    @Field((type) => ImagekitFileUploadObject, { nullable: true })
    file?: ImagekitFileUploadObject;

    @Field((type) => ImagekitFileUploadObject, { nullable: true })
    thumbnail?: ImagekitFileUploadObject; 
}

