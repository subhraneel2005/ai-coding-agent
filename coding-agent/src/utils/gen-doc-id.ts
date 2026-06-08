import { randomUUID } from "crypto";

export function generateDocId(prefix = "doc"): string {
    return `${prefix}_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

// output like this -> doc_1709132456789_a1b2c3d4