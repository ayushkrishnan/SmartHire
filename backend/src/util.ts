import {createHash} from "node:crypto";

export function hash(text: string){
    const hash = createHash("sha256");
    hash.update(text);

    return hash.digest("hex");
}