import { readFile } from "fs/promises";
import { existsSync, mkdirSync, writeFileSync } from "fs";

export async function loadMemory() {
  if (!existsSync(".agent")) {
    mkdirSync(".agent", { recursive: true });
  }

  const files = {
    agent: ".agent/AGENT.md",
    project: ".agent/PROJECT.md",
    user: ".agent/USER.md",
  };

  for (const path of Object.values(files)) {
    if (!existsSync(path)) writeFileSync(path, "");
  }

  const agent = await readFile(files.agent, "utf8");
  const project = await readFile(files.project, "utf8");
  const user = await readFile(files.user, "utf8");

  return { agent, project, user };
}