import { glob } from "glob"
import { SearchFilesResultSchema, SearchFilesSchema, type SearchFiles, type SearchFilesResult } from "../types/tool-types";
import path from "path"
import { tool } from "ai";

async function searchFiles({ folder, pattern }: SearchFiles): Promise<SearchFilesResult> {

    const root = process.cwd()

    const basePath = folder
        ? path.resolve(root, folder)
        : root

    if (!basePath.startsWith(root)) {
        throw new Error("Invalid folder path")
    }

    try {
        const files = await glob(pattern || "**/*", { cwd: basePath, ignore: ["node_modules/**", ".git/**", "dist"] });

        const fullPaths = files.map((file) => path.join(basePath, file))

        console.log("found files: ", files);


        return {
            success: true,
            files: fullPaths
        };
    } catch (err: any) {
        console.error('Error searching for files:', err);

        return {
            success: false,
            error: String(err)
        }
    }
}

export const searchFilesTool = tool({
    description: "Search for files in the project using a glob pattern. Optionally specify a folder path relative to the project root to limit the search scope; otherwise, the entire project is searched. Returns a list of matching file paths.",
    inputSchema: SearchFilesSchema,
    outputSchema: SearchFilesResultSchema,
    execute: searchFiles
})

// searchFiles({
//     pattern: "**/tools/**/*.ts"
// })