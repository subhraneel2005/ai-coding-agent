#!/usr/bin/env bun
process.on("unhandledRejection", () => {});

import { LoadAPIKeyError, type ErrorHandler } from "ai";
import { codingAgent } from "..";
import type { UserInputQuery } from "../types/agent-types";
import type {
  EditFileInput,
  EditFileOutput,
  SingleTodo,
  Todos,
} from "../types/tool-types";
import { askUser } from "../utils/ask-user";
import { editFile } from "../tools/edit-file";
import { printDiff } from "../utils/print-diff";
import { Box, render, Text } from "ink";
import React, { useState } from "react";
import { PromptInput } from "../components/text-input";
import TodoList from "../components/todo-list";
import Blob from "../components/blob";
import { ThinkingDots } from "../components/thinking-loader";
import { existsSync, mkdirSync, writeFileSync } from "fs"

type EditFileResultWithInput = EditFileOutput & { _input: EditFileInput };

export default function RunAgent() {
  const [query, setQuery] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [todos, setTodos] = useState<SingleTodo[]>([]);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function runAgent({ query }: UserInputQuery) {
    const editToolResults: EditFileResultWithInput[] = [];

    if(!existsSync(".agent")){
      mkdirSync(".agent", {recursive: true})
    }
    if(!existsSync(".agent/USER.md")) writeFileSync(".agent/USER.md", "")
    if(!existsSync(".agent/AGENT.md")) writeFileSync(".agent/AGENT.md", "")
    if(!existsSync(".agent/PROJECT.md")) writeFileSync(".agent/PROJECT.md", "")

    try {
      const result = await codingAgent.stream({
        prompt: `Assist with user query ${query} and respond with ANSWER: [your answer]`,
      });

      for await (const chunk of result.fullStream) {
        switch (chunk.type) {
          case "text-delta":
            setAnswer((prev) => prev + chunk.text); // append text to state
            break;

          case "tool-result": {
            if (chunk.toolName === "edit_file") {
              editToolResults.push({
                ...(chunk.output as EditFileOutput),
                _input: chunk.input as EditFileInput,
              });
            }
            if (chunk.toolName === "createAllTodosTool") {
              const result = chunk.output as Todos;
              setTodos(result.todos);
            }

            if (chunk.toolName === "createTodoTool") {
              const todo = chunk.output as SingleTodo;
              setTodos((prev) => [...prev, todo]);
            }

            if (chunk.toolName === "updateTodoStatusTool") {
              const result = chunk.output as Todos;
              setTodos(result.todos);
            }
          }
        }
      }

      process.stdout.write("\n");

      for (const output of editToolResults) {
        if (output.success && output.needsApproval) {
          printDiff(output.preview!);
          const answer = await askUser("Apply changes? (y/n): ");
          if (answer === "y" || answer === "yy") {
            await editFile({ ...output._input, isApproved: true }); // use stored input
            console.log("✅ Changes applied");
          } else {
            console.log("❌ Changes cancelled");
          }
        }
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsRunning(false);
    }
  }

  const handlePromptSubmit = async (val: string) => {
    setAnswer("");
    setTodos([]);

    setHistory((prev) => [...prev, val]);
    setQuery(val);
    setIsRunning(true);
    setIsLoading(true);

    await runAgent({ query: val });

    // setIsRunning(false);
  };

  return (
    <Box flexDirection="column">
      {history.map((h, i) => (
        <Box key={i} marginBottom={1}>
          <Text color="blue">you:</Text>
          <Text> {h}</Text>
        </Box>
      ))}
      {todos.length > 0 && <TodoList todos={todos} />}

      {answer && (
        <Box marginTop={1}>
          <Text color="green">{answer}</Text>
        </Box>
      )}
      {!isRunning && (
        <Box flexDirection="column">
          <Blob />
          <PromptInput onSubmit={handlePromptSubmit} />
        </Box>
      )}
      {isRunning && <ThinkingDots />}
    </Box>
  );
}

function handleError(error: unknown) {
  if (
    LoadAPIKeyError.isInstance(error) ||
    (error instanceof Error && error.name === "AI_LoadAPIKeyError")
  ) {
    console.error("❌ OpenRouter API key not found.");
    console.error("Set it with:");
    console.error("export OPENROUTER_API_KEY=your_key");
    return;
  }

  console.error("❌ Agent failed:", (error as Error).message);
}

render(<RunAgent />);
