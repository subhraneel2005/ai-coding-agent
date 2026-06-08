import { embedFile } from "../rag-actions/embed-file";
import type { QueueFiles } from "../types/embed-types";


export async function queueFiles({ files }: QueueFiles) {

    if (!files?.length) {
        throw new Error("No files provided to queueFiles");
    }

    for (const file of files) {
        try {
            await embedFile({
                filename: file.filename,
                fileContent: file.fileContent,
                repoName: file.repoName
            })
        }
        catch (error) {
            console.error(`Failed to embed file: ${file.filename}`, error);
            continue;
        }
    }
}
