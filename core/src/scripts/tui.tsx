import React, { useState } from "react";
import { render, Box, Text } from "ink";
import TextInput from "ink-text-input";

const PromptInput = () => {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (val: string) => {
    setSubmitted(true);
    console.log("User prompt:", val);
  };

  if (submitted) {
    return (
      <Box>
        <Text>You entered: {value}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text>Enter prompt:</Text>
      <Box borderStyle="round" borderColor="cyan" paddingX={1}>
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="Type your prompt..."
        />
      </Box>
    </Box>
  );
};

render(<PromptInput />);