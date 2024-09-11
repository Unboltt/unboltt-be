export interface ICloudinaryUploadResponse{
    public_id: string,
    format: string,
    resource_type: CloudinaryFileUploadType,
    bytes: number,
    url: string,
    secure_url: string
}

export interface IImagekitUploadResponse{
    fileId: string,
    name: string,
    size: number,
    versionInfo: { id: string, name: string },
    filePath: string,
    url: string,
    fileType: ImagekitFileUploadType,
    height: number,
    width: number,
    orientation?: number,
    thumbnailUrl?: string,
    bitRate?: number,
    duration?: number,
    audioCodec?: string,
    videoCodec?: string,
    metadata?: {
        height?: number,
        width?: number,
        bitRate?: number,
        duration?: number,
        audioCodec?: string,
        ideoCodec?: string,
        size?: number
    },
    isPrivateFile?: boolean,
    folder?: string
}

export enum CloudinaryFileUploadType{
    IMAGE = "image",
    VIDEO = "video",
    RAW = "raw"
}

export enum ImagekitFileUploadType{
    IMAGE = "image",
    NON_IMAGE = "non-image",
}

export enum FileUploadFolders{
    IMAGES = "Unboltt_Images",
    VIDEOS = "Unboltt_Videos",
    FILES = "Unboltt_Raw_Files"
}

export interface ICloudinaryUploadConfig{
    resource_type?: string,
    folder?: string
}

export interface IImagekitUploadConfig{
    isPrivateFile?: boolean,
    folder?: string
}

export interface IFileStream{
    fieldName: string,
    filename: string,
    mimetype: string,
    encoding: string,
    createReadStream: Function
}

export interface IImagekitTransforms{
    blur?: number,
}

export interface IImagekitMultiUpload{
    file: any,
    thumbnail?: any,
    config?: IImagekitUploadConfig
}