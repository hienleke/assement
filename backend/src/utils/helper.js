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


export function required(name, fallback) {
    const value = process.env[name];
    if (value === undefined || value === "") return fallback;
    return value;
}

export function optional(name) {
    const value = process.env[name];
    if (value === undefined || value === "") return undefined;
    return value;
}