import { tool } from "ai";
import fs from "node:fs/promises";
import path from "path";
import { GrepInputSchema, GrepOutputSchema, type GrepInput, type GrepOutput } from "../types/tool-types";

async function grep({ pattern, filename }: GrepInput): Promise<GrepOutput> {
  try {
    const filePath = path.resolve(filename);
    const stat = await fs.stat(filePath);

    if (!stat.isFile()) {
      return { success: false, error: "Provided path is not a file" };
    }

    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split("\n");
    const matches = lines.filter(line => line.includes(pattern));

    return { success: true, matches };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export const grepTool = tool({
  description: "Search for a string pattern in a file and return matching lines.",
  inputSchema: GrepInputSchema,
  outputSchema: GrepOutputSchema,
  execute: grep
});