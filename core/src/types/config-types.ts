import { z } from "zod";

export enum ProviderEnum {
  openrouter = "openrouter",
  google = "google",
  openai = "openai",
}

// Global config (~/.config/nini/config.json)
export const GlobalAgentConfig = z.object({
  apiKeys: z.object({
    openrouter: z.string(),
    google: z.string(),
    exa: z.string(),
    openai: z.string(),
  }),
  preferences: z.object({
    defaultProvider: z.enum(ProviderEnum).default(ProviderEnum.openrouter),
    defaultModel: z.string().default("openrouter/free"),
  }),
});

// Project config (<project>/.nini/config.json)
export const ProjectConfig = z.object({
  defaultProvider: z.enum(ProviderEnum),
  defaultModel: z.string(),
});

// Session config (global scoped) (~/.config/nini/sessions/<projectHash>/<sessionId>.json)

export const Message = z.object({
  role: z.enum(["system", "user", "assistant", "tool"]),
  content: z.string(),
  timestamp: z.iso.datetime(),
});

export const SessionConfig = z.object({
  id: z.uuid(),
  projectHash: z.string(),
  provider: z.enum(ProviderEnum),
  model: z.string(),
  tokenUsed: z.number(),
  messages: z.array(Message),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

// Index book/Lookup table to find projects using their hash in O(1) time using record instead of array, because record is a hashtable and array is not.
export const ProjectIndex = z.record(
  z.string(), //projectHash
  z.object({
    projectPath: z.string(),
    lastOpened: z.iso.datetime(),
  }),
);

export type ProviderType = z.infer<typeof ProviderEnum>;
export type GlobalAgentConfigType = z.infer<typeof GlobalAgentConfig>;
export type ProjectConfigType = z.infer<typeof ProjectConfig>;
export type SessionConfigType = z.infer<typeof SessionConfig>;
export type MessageType = z.infer<typeof Message>;
export type ProjectIndexType = z.infer<typeof ProjectIndex>;


// complete structure:

// global (sessions, projects recordBook, config)
/* 
/Users/subhraneel-macos/.config/nini/
├── config.json
├── projects.json --> record book 
└── sessions/
    ├── 6c92d8ab/
    │   ├── session1.json
    │   └── session2.json
    └── 91af2c11/
        └── session1.json
*/

// projectScoped config
/* /Users/subhraneel-macos/projects/nini/
└── .nini/
    └── config.json
*/