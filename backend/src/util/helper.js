import fs from "node:fs";
export function decodePayload(payload) {
    const text = payload.toString("utf8");
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}
export function loadCertificate(certificatePath) {
    if (!certificatePath) return undefined;
    const ca = fs.readFileSync(certificatePath);
    return ca;
}
