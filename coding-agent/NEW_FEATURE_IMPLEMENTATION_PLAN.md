# New Feature Implementation Plan

## Overview

This plan covers the next major iteration of the terminal coding agent — transforming it into a fully-featured open-source alternative to Claude Code. Five feature areas are covered, each building on the previous.

---

## Phase 1: Configuration & Provider System

**Goal:** Replace hardcoded OpenRouter model selection and `.env`-only API keys with a dynamic, user-configurable provider system.

### Files to create:

| File | Purpose |
|------|---------|
| `src/types/config-types.ts` | Zod schemas for config, provider, model, API keys |
| `src/config/provider.ts` | Provider factory — returns AI SDK `model` from config |
| `src/config/manager.ts` | Read/write `.agent/config.json` (JSON-based config persistence) |

### Files to modify:

| File | Change |
|------|--------|
| `src/config/openrouter.ts` | Accept dynamic `apiKey` param instead of reading `process.env` |
| `src/utils/select-model.ts` | Read model list and credentials from config instead of hardcoded env |
| `src/index.ts` | Use config-based model instead of hardcoded `openrouter.chat("openrouter/free")` |

### Config shape (`.agent/config.json`):

```json
{
  "activeProvider": "openrouter",
  "activeModel": "openrouter/free",
  "apiKeys": {
    "openrouter": "sk-or-...",
    "google": "AIza...",
    "exa": "..."
  },
  "usage": {
    "totalTokens": 0,
    "sessions": 0
  },
  "preferences": {
    "defaultProvider": "openrouter",
    "defaultModel": "openrouter/free"
  }
}
```

### API:

- `getModel()` — returns a configured AI SDK model based on active config
- `updateConfig(key, value)` — update any config field
- `setApiKey(provider, key)` — set key for a specific provider
- `getUsage()` — return accumulated token/session usage
- `trackUsage(tokens)` — increment usage counters

---

## Phase 2: Sessions & Conversation History

**Goal:** Session-based chat with persistent conversation history, session management, and export.

### Files to create:

| File | Purpose |
|------|---------|
| `src/types/session-types.ts` | Zod schemas for session data |
| `src/utils/session-manager.ts` | Session CRUD — create, list, read, append, export |

### Files to modify:

| File | Change |
|------|--------|
| `src/scripts/run-agent.tsx` | On startup: prompt for new/resume session; persist messages during streaming |
| `src/tools/planner/todo-actions.ts` | Include session ID in plan context for continuity |

### Session shape (`.agent/sessions/<id>.json`):

```json
{
  "id": "session-uuid",
  "createdAt": "2026-06-09T10:00:00Z",
  "updatedAt": "2026-06-09T10:30:00Z",
  "model": "openrouter/free",
  "provider": "openrouter",
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "tokenUsage": { "total": 1500 },
  "messageCount": 12
}
```

### API:

- `createSession(model, provider)` → session ID
- `getSession(id)` → session data
- `listSessions()` → recent sessions (sorted by `updatedAt`, newest first)
- `appendMessage(sessionId, message)` → append to message array, persist
- `exportSession(id, format)` → write markdown or JSON to cwd
- `deleteSession(id)` → remove session file

### Startup flow:

1. On launch, read `.agent/sessions/` for recent sessions
2. If sessions exist, prompt: new session or pick from list (show: date, model, message count)
3. If new session → call `createSession()`
4. During agent stream → `appendMessage()` for each user/assistant turn
5. On `/export` command → export current or specified session

---

## Phase 3: Parallel Sub-Agents

**Goal:** Run multiple executor sub-agents in parallel, each handling one todo with file-level isolation, orchestrated by a manager.

### Architecture

```
User Query
    │
    ▼
Orchestrator (main agent)
    │
    ├── Planner Sub-Agent
    │   └── Breaks task into todos with file metadata + conflict check
    │
    ├── Executor A (todo-1) ──► files: [src/a.ts]        ──► status report
    ├── Executor B (todo-2) ──► files: [src/b.ts]        ──► status report
    ├── Executor C (todo-3) ──► files: [src/c.ts]        ──► status report
    │        (all run via Promise.allSettled)
    │
    └── Aggregate results, report to user
```

### Files to create:

| File | Purpose |
|------|---------|
| `src/sub-agents/executor/executor-agent.ts` | Single-todo executor `ToolLoopAgent` |
| `src/sub-agents/executor/instructions.ts` | System prompt for executor sub-agent |
| `src/sub-agents/orchestrator.ts` | Parallel execution manager |

### Files to modify:

| File | Change |
|------|--------|
| `src/types/tool-types.ts` | Add `files: string[]` to `SingleTodoSchema` |
| `src/sub-agents/planner/instructions.ts` | Tell planner to search codebase & assign `files` to each todo |
| `src/sub-agents/planner/planner-agent.ts` | Update to populate `files` field during planning |
| `src/tools/planner/todo-actions.ts` | Add executor status reporting tools |
| `src/tools-registry.ts` | Register new executor/reporting tools |
| `src/index.ts` | Route to orchestrator instead of direct agent execution |

### Todo schema update (`SingleTodoSchema`):

```ts
{
  id: "task-3",
  todo: "Add input validation to auth.ts",
  files: ["src/auth.ts", "src/validators.ts"],  // NEW — assigned by planner
  status: "not completed",
  priority: 2
}
```

### Conflict prevention (in planner):

1. Planner searches/reads the codebase to understand file dependencies for each atomic task
2. Assigns `files: [...]` to each todo based on what it discovers
3. Checks for file overlaps between todos:
   - If no overlap → tasks can run in parallel
   - If overlap → merge tasks or mark as sequential (same batch)
4. Outputs todos with guaranteed non-overlapping file sets for parallel execution

### Executor sub-agent:

- Gets single todo + `files` array as context
- Tool scope restricted to assigned files (file tools accept only these paths)
- Toolset: `read_file`, `write_file`, `edit_file`, `grep`, `run_command`, `report_status`
- Reports: `reportStatus(todoId, status, summary?)` → "in-progress", "completed", "failed"

### Orchestrator:

1. Receive user query
2. Call planner → get todos with file metadata
3. Group todos into waves (parallel compatible sets)
4. Spawn executor agents via `Promise.allSettled()`
5. Listen to status reports, aggregate results
6. Report final summary to user

---

## Phase 4: Simpler TUI + Settings Screen

**Goal:** Simplify the UI by using Ink only where interactive input is needed; use `console.log` for everything else. Add a settings screen accessible from the chat.

### Philosophy

| Use case | Render method |
|----------|---------------|
| Interactive text input | Ink (`TextInput`) |
| Live todo status board | Ink (for reactivity) |
| Session picker menu | Ink (`SelectInput`) |
| Settings UI | Ink (forms, selects) |
| Agent responses / thinking | `console.log` |
| Errors, diffs, token usage | `console.log` |
| Status messages | `console.log` |

### Files to create:

| File | Purpose |
|------|---------|
| `src/components/settings-screen.tsx` | Settings TUI (model, provider, API keys, usage) |
| `src/components/session-picker.tsx` | Session selector on startup |

### Files to modify:

| File | Change |
|------|--------|
| `src/scripts/run-agent.tsx` | Flatten component tree; route to settings when `/settings` entered |
| `src/components/app.tsx` | Remove if redundant; unify into `run-agent.tsx` |
| `src/components/thinking.tsx` | Replace with `console.log`-based streaming |
| `src/components/blob.tsx` | Simplify — reduce to minimal welcome message |

### Settings screen (command: `/settings`):

```
┌─────────────────────────────────────┐
│  Settings                            │
│                                     │
│  ❯ Provider    [OpenRouter]         │
│    Model       [openrouter/free]    │
│    API Keys                         │
│      OpenRouter  ••••••••••••••••   │
│      Google      ••••••••••••••••   │
│    Usage                            │
│      Total tokens  15,342           │
│      Sessions      8                │
│                                     │
│    [Save]  [Cancel]                 │
└─────────────────────────────────────┘
```

### Key bindings:

- `Ctrl+S` or enter `/settings` → open settings
- `Ctrl+N` or enter `/new` → new session
- `Ctrl+E` or enter `/export` → export current session
- `Ctrl+L` or enter `/sessions` → list sessions

---

## Execution Order

```
Phase 1: Config & Providers
    │
    ▼
Phase 2: Sessions & History
    │
    ▼
Phase 3: Parallel Sub-Agents
    │
    ▼
Phase 4: TUI Simplification & Settings
```

Each phase is a prerequisite for the next:
- Config is needed for sessions (which provider/model was used)
- Sessions are needed for the orchestrator context window
- UI polish is independent but saved for last since it's cosmetic

---

## Key Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| File conflicts during parallel execution | Structural prevention at plan time + runtime lock as safety net |
| `ToolLoopAgent` not designed for parallel agents | Each executor is its own `ToolLoopAgent` instance; orchestrated via `Promise.allSettled` |
| API keys stored in plaintext on disk | `.agent/config.json` is gitignored; V2 can add OS keychain integration |
| Sub-agent context window too small | Single-todo scope means smaller context — faster & cheaper per executor |
| Session files accumulate over time | Add trim/archive command; auto-prune sessions older than N days |
