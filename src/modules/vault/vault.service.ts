import { ForbiddenException, HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PageParams, PageResult, Vault } from "./vault.schema";
import { Types } from "mongoose";
import { VaultRepository } from "./vault.repository";
import { FileUploadService } from "../upload/upload.service";
import { IImagekitMultiUpload, ImagekitFileUploadType } from "../upload/upload.interface";
import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";
import { currencyFormatter } from "src/common/formatCurrency";
import { VaultAccessService } from "./access/access.service";

@Injectable()
export class VaultService{
    constructor(
        private vaultRepo: VaultRepository,
        private fileUpload: FileUploadService,
        private userSvc: UserService,
        private mailSvc: MailService,
        private accessSvc: VaultAccessService,
    ){}

    public async create(model: Vault): Promise<Vault> {
        const vaultCount = await this.vaultRepo.count({userId: new Types.ObjectId(model.userId)}) + 1;
        model.name = `Vault ${vaultCount}`;
        model.link = await this.generateVaultLink(model.userId.toString());

        if (!!model?.files?.length) {
            let upload:IImagekitMultiUpload[] = [];

            for(let file in model.files){
                upload.push({file: model.files[file].file, thumbnail: model.files[file].thumbnail, config:{folder:model.userId.toString(), isPrivateFile: true}})
            }

            model.files = await this.fileUpload.uploadFilesImagekit(upload) as any;
            console.log(!!model?.files[0]?.file, "here again");
            if(!!model?.files[0]?.file){
                for(let file in model.files){
                    if(model?.files[file]?.file?.fileType === ImagekitFileUploadType.IMAGE){
                        model.files[file].file.signed_url = await this.fileUpload.getFileUrlImagekit(model.files[file].file.filePath, true, {});
                        model.files[file].file.preview_signed_url = await this.fileUpload.getFileUrlImagekit(model.files[file].file.filePath, true, {blur: 100});
                    }else{
                        if(
                            model?.files[file]?.file?.filePath.includes("MP4") ||
                            model?.files[file]?.file?.filePath.includes("MOV") ||
                            model?.files[file]?.file?.filePath.includes("WebM") ||
                            model?.files[file]?.file?.filePath.includes("MPEG") ||
                            model?.files[file]?.file?.filePath.includes("3GP") ||
                            model?.files[file]?.file?.filePath.includes("HEVC") ||
                            model?.files[file]?.file?.filePath.includes("OGV") ||
                            model?.files[file]?.file?.filePath.includes("OGG")
                        ){
                            model.files[file].thumbnail.signed_url = await this.fileUpload.getFileUrlImagekit(model.files[file].thumbnail.filePath, true, {});
                            model.files[file].thumbnail.preview_signed_url = await this.fileUpload.getFileUrlImagekit(model.files[file].thumbnail.filePath, true, {blur: 100});
                        }
                        model.files[file].file.signed_url = await this.fileUpload.getFileUrlImagekit(model.files[file].file.filePath, true, {});
                    }
                }
                model.files = model.files.map((file) => ({
                ...file,
                _id: new Types.ObjectId(),
                }));
            }else{
                throw new HttpException("Need files to create a vault", HttpStatus.NOT_ACCEPTABLE);
            }
        }

        const vault =  await this.vaultRepo.create({
            ...model,
            createdAt: Date.now(),
        });

        return vault;
    }
    
    public async update(id: string, model: Partial<Vault>): Promise<Vault> {

        if (!!model?.files?.length) {
            model.files = [
            ...(!!model?.files?.length ? model.files : []),
            ...model?.files?.map((f) => ({
                ...f,
                _id: new Types.ObjectId() as any,
            })),
            ];
        }

        await this.vaultRepo.update(id, model);

        return this.vaultRepo.findOne({ _id: id } as any);
    }

    public async delete(id: string): Promise<Boolean> {
        await this.vaultRepo.delete(id);
        return true;
    }

    public async findOne(model: Partial<Vault>): Promise<Vault> {
        return this.vaultRepo.findOne(model);
    }

    public async find(model: Partial<Vault>): Promise<Vault[]> {
        return this.vaultRepo.find(model);
    }

    public async deleteFile(vaultID: string, fileID: string): Promise<Boolean> {
        const vault = await this.findOne({ _id: vaultID } as any);

        const file = vault.files.find((f) => f?._id?.toString() === fileID);

        try {
            if (file) {
                await this.fileUpload.bulkDeleteFilesImagekit([file.file.fileId, file.thumbnail.fileId]);
                await this.vaultRepo.update(vaultID, {
                    files: vault.files.filter(
                    (f) => f?._id?.toString() !== fileID
                    ),
                });
            }
        } catch (error) {}

        return true;
    }

    public async page(query: Partial<Vault>, page: PageParams): Promise<PageResult<Vault>> {
        return this.vaultRepo.page(query, page);
    }

    public async count(query: Partial<Vault>){
        return this.vaultRepo.count(query);
    }

    public generateVaultCode(id: string): string {
        id = id.substring(id.length - 5);
        return id + Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    public async generateVaultLink(userID: string): Promise<string> {
        const user = await this.userSvc.findOne({ _id: new Types.ObjectId(userID) });
        if (!user) {
            throw new ForbiddenException("Unable to find User, can't generate vault link");
        }

        return `/v/${this.generateVaultCode(user._id.toString())}`;


    }

    public async accessVault(transactionId:string, email: string, vaultId: string): Promise<boolean>{
        const vault = await this.findOne({_id: new Types.ObjectId(vaultId)});
        const user = await this.userSvc.findOne({_id: vault.userId});
        const file_links = [];
        for(let link in vault.files){
            file_links.push(vault.files[link].file.signed_url);
        }
        const access = await this.accessSvc.create({
            link: `${process.env.BASE_URL}/v/${transactionId}`,
            vaultId: vault._id,
            file_links
        } as any);

        this.mailSvc.sendVaultAccessEmail(access.link, currencyFormatter(vault.price), vault.name, user.username, email);
        return true;
    }
}