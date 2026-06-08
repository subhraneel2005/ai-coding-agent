import z from "zod";

export const EmbedFileSchema = z.object({
    filename: z.string(),
    fileContent: z.string(),
    repoName: z.string()
})

export type EmbedFile = z.infer<typeof EmbedFileSchema>

export type QueueFiles = {
    files: EmbedFile[]
}