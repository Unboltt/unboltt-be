import { Stream } from "stream";

async function streamTobuffer(stream: Stream): Promise<Buffer> {

    return new Promise <Buffer> ((resolve, reject) => {
        
        const _buf = Array <any> ();

        stream.on("data", chunk => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", err => reject(`error converting stream - ${err}`));

    });
}

export {streamTobuffer}