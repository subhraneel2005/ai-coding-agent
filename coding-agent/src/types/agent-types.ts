import z from "zod";

export enum Tools {
    SemanticSearch = "semantic_search",
    GetGithubDiff = "get_github_diff",
    GenerateReview = "generate_review_report",
    SendTelegram = "send_telegram_message",
    Grep = "grep_tool"
}

export const UserInputQuerySchema = z.object({
    query: z.string()
})

// embedFile() for embedding a file into vector db
//  upsertVector() for updating embeddings based on github_diff
//  deleteVector() for deleting the documents whose files are completely removed in the github_diff

export const AgentInputSchema = z.object({
    githubRepo: z.url(),
    prNumber: z.number(),
    branch: z.string(),
    mainBranch: z.string(),

    codeChanges: z.string(),

    commtMessage: z.string(),
    commitDescription: z.string().optional(),
    changedFiles: z.array(z.string()),

    issueNumber: z.number().optional(),
})

export type UserInputQuery = z.infer<typeof UserInputQuerySchema>
export type AgentInput = z.infer<typeof AgentInputSchema>