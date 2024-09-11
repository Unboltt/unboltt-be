import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { VaultAccessService } from './access.service';
import { WalletTransactionService } from 'src/modules/wallet/transaction/transaction.service';
import { VaultService } from '../vault.service';
var JSZip = require("jszip");



@Controller("v")
export class VaultAccessController {
  constructor(
    private accessSvc: VaultAccessService,
    private vaultSvc: VaultService,
    private tranSvc: WalletTransactionService,
  ) {}

  // @Get(":transactionId")
  // async accessVault(@Req() req: Request, @Res() res: Response, @Param("transactionId") transactionId: string) {
  //   // const http = require('http'); // or 'https' for https:// URLs
  //   // const fs = require('fs');
  //   // var zip = new JSZip();

  //   // const file = fs.createWriteStream("file.jpg");
  //   // const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
  //   // response.pipe(file);



  //   // // after download completed close filestream
  //   // file.on("finish", async () => {
  //   //     file.close();
  //   //     console.log(file.path);

  //   //     const data = fs.readFileSync(file.path);

  //   //     const fileFolder = zip.folder("files");
  //   //     fileFolder.file(file.path, data);
  //   //     const zipAsBlob = await fileFolder.generateAsync({type:"blob"});
  //   //     res.setHeader('Content-Length', zipAsBlob.size);
  //   //     res.setHeader('Content-Type', 'application/zip');
  //   //     res.write(Buffer.from(await zipAsBlob.arrayBuffer()), 'binary');     
  //   //     console.log("Download Completed");
  //   // });
  //   // });
  //   const zipAsBlob = await this.accessSvc.downloadVaultFiles(transactionId);
  //   // res.setHeader('Content-Length', zipAsBlob.size);
  //   // res.setHeader('Content-Type', 'application/zip');
  //   // res.write(Buffer.from(await zipAsBlob.arrayBuffer()), 'binary');
  //   res.setHeader('Content-Type', 'application/zip');
  //   res.write(zipAsBlob, 'binary');
  //   res.end();
  // }

  @Get(":transactionId")
  async accessVault(@Req() req: Request, @Res() res: Response, @Param("transactionId") transactionId: string) {
    const transaction = await this.tranSvc.findOne({transactionId});
    if(!transaction){
      throw new HttpException("Transaction not found", HttpStatus.NOT_FOUND);
    }
    const vault = await this.vaultSvc.findOne(({_id: transaction.vaultId}));
    if(!vault){
      throw new HttpException("Vault not found", HttpStatus.NOT_FOUND);
    }

    const http = require('https');
    const fs = require('fs');
    var zip = new JSZip();

    for(let file_url in vault.files){
      const filePath = vault.files[file_url].file.name;
      const file = fs.createWriteStream(`uploads/${filePath}`);

      http.get(vault.files[file_url].file.signed_url, function(response) {
        response.pipe(file);
        file.on("finish", async () => {
          file.close();

          const data = fs.readFileSync(file.path);
          // console.log(filePath);
          // console.log(data);
          
          zip.file(filePath, data);
          fs.unlinkSync(`uploads/${filePath}`);

          if(Number(file_url) == (vault.files.length - 1)){

            await zip.generateAsync({type:"blob"}).then(async (blob:Blob)=>{
              res.setHeader('Content-Length', blob.size);
              res.setHeader('Content-Type', 'application/zip');
              res.write(Buffer.from(await blob.arrayBuffer()), 'binary');
              res.end();
              //TODO:redirect user to downloading page on FE
              //console.log("Done sending res to client, but I'm still running");
            });
          }
        });
      });
    }

    // const file = fs.createWriteStream(vault.files[0].file.name);
    // const request = http.get(vault.files[0].file.signed_url, function(response) {
    //   response.pipe(file);
    //   file.on("finish", async () => {
    //     file.close();
    //     console.log(file.path);

    //     const data = fs.readFileSync(file.path);
    //     console.log(data);
        
    //     zip.file(file.path, data);
    //     const zipAsBlob = await zip.generateAsync({type:"blob"});
    //     res.setHeader('Content-Length', zipAsBlob.size);
    //     res.setHeader('Content-Type', 'application/zip');
    //     res.write(Buffer.from(await zipAsBlob.arrayBuffer()), 'binary');
    //     res.end();
    //   });
    // });
  }
}