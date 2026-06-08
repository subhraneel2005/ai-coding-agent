import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import Thinking from "./thinking";
import { ToolLoopAgent } from "ai";
import { selectModel } from "../utils/select-model";
import { tools } from "../tools-registry";
import { hasReviewComment } from "../utils/agent-utils";

function createCodingAgent(chatModel: Awaited<ReturnType<typeof selectModel>>["chatModel"]) {
  return new ToolLoopAgent({
    model: chatModel,
    instructions: `
You're a helpful coding agent.
Always finish with "ANSWER:".
`,
    tools,
    stopWhen: hasReviewComment,
  });
}

export default function App() {
  const [value, setValue] = useState("");
  const [thinking, setThinking] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [running, setRunning] = useState(false);
  const [agent, setAgent] = useState<ReturnType<typeof createCodingAgent> | null>(null);

  useEffect(() => {
    async function init() {
      const { chatModel, modelId } = await selectModel();
      console.log("using model:", modelId);

      setAgent(createCodingAgent(chatModel));
    }

    init();
  }, []);

  const runAgent = async (query: string) => {
    if (!agent) return;

    setRunning(true);
    setThinking([]);
    setAnswer("");

    const result = await agent.stream({
      prompt: query,
    });

    let buffer = "";

    for await (const chunk of result.fullStream) {
      switch (chunk.type) {
        case "reasoning-delta":
          buffer += chunk.text ?? "";

          if (buffer.includes("\n")) {
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            setThinking((prev) => [...prev, ...lines]);
          }
          break;

        case "text-delta":
          setAnswer((prev) => prev + chunk.text);
          break;
      }
    }

    setRunning(false);
  };

  const handleSubmit = async (val: string) => {
    setValue("");
    await runAgent(val);
  };

  return (
    <Box flexDirection="column">
      <Text bold>AI Coding Agent</Text>

      <Box marginTop={1} flexDirection="column">
        <Text>Enter prompt:</Text>
        <Box borderStyle="round" borderColor="whiteBright" borderDimColor>
          <TextInput
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            placeholder="Type your prompt..."
          />
        </Box>
      </Box>

      {running && thinking.length > 0 && <Thinking thinking={thinking} />}

      {answer && (
        <Box marginTop={1}>
          <Text>{answer}</Text>
        </Box>
      )}
    </Box>
  );
}
