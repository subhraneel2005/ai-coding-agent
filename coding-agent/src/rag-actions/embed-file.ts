import { GoogleGeminiEmbeddingFunction } from "@chroma-core/google-gemini";
import type { EmbedFile } from "../types/embed-types";
import { generateDocId } from "../utils/gen-doc-id";
import { ChromaClient } from "chromadb";

const client = new ChromaClient();

const embedder = new GoogleGeminiEmbeddingFunction({
    apiKey: "<YOUR API KEY>",
    modelName: "gemini-embedding-001",
});

export async function embedFile({ fileContent, filename, repoName }: EmbedFile) {

    const documentId = generateDocId()

    const collection = await client.getOrCreateCollection({
        name: repoName,
        embeddingFunction: embedder
    })

    await collection.add({
        ids: [documentId],
        documents: [fileContent],
        metadatas: [
            {
                filename,
                type: "source_code_file",
                repoName,
                createdAt: new Date().toISOString()
            }
        ]
    })

    return { documentId }
}

/*  we dont need to send all the files in the embedding pipeline,
instead we should create a sub-agent that will
take the whole repo tree structure and it will decide and return the imp file paths */

// obvious skips are: node_modules, dist, lockfiles, staic assests, .agent, .claude, .cursor, .claude_code, like this.
//  but dont skip .github as ci/cd files can be present there

// get data to create embeddings
// repo --> all files --> file path --> single file --> content data 
