import { Readable } from "stream";
/**
 * Convert a Readable Stream to base64 string
 * @param {ReadableStream} stream - a readable stream to convert in base64 string
 * @returns {Promise} - Promise that resolve in a string containing the base64
 */


const streamToBase64 = (stream: Readable) => {
    const concat = require('concat-stream');
    const { Base64Encode } = require('base64-stream');
  
    return new Promise((resolve, reject) => {
        const base64 = new Base64Encode();
    
        const cbConcat = (base64: any) => {
            resolve(base64);
        }
  
        stream.pipe(base64).pipe(concat(cbConcat)).on('error', (error: any) => {
          reject(error);
        });
    });
}

const toBase64String = (mimetype:string, base64: string): string =>{
    return `data:image/${mimetype};base64,${base64}`;
}

export { streamToBase64, toBase64String };
  