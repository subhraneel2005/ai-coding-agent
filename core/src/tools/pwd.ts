import { tool } from "ai";
import path from "path";
import {
  PwdInputSchema,
  PwdOutputSchema,
  type PwdInput,
  type PwdOutput,
} from "../types/tool-types";
import fs from "node:fs/promises";

async function pwd({ filename }: PwdInput): Promise<PwdOutput> {
  try {
    let currentDir: string;

    if (filename) {
      const fullPath = path.resolve(filename);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        currentDir = fullPath;
      } else {
        currentDir = path.dirname(fullPath);
      }
    } else {
      currentDir = process.cwd();
    }

    return {
      success: true,
      pwd: currentDir,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `error getting current dir.\nmessage: ${err.message}`,
    };
  }
}

export const pwdTool = tool({
  description:
    "Get the current working directory. If a filename is provided, returns the directory containing that file.",
  inputSchema: PwdInputSchema,
  outputSchema: PwdOutputSchema,
  execute: pwd,
});
