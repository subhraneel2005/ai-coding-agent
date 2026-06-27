import React, { useState } from "react";
import { Box } from "ink";
import TextInput from "ink-text-input";

export const PromptInput = ({
  onSubmit
}: {
  onSubmit: (value: string) => void
}) => {
  const [value, setValue] = useState("");

  // Function to convert paragraphs/newlines into a single line
  const handleInputChange = (val: string) => {
    const singleLineText = val.replace(/\r?\n|\r/g, " ");
    setValue(singleLineText);
  };

  const handleSubmit = (val: string) => {
    onSubmit(val.trim());
    setValue("");
  };

  return (
    <Box flexDirection="column" width="100%">
      <Box 
        borderStyle="round" 
        borderColor="whiteBright" 
        borderDimColor
        paddingX={1}
        width="100%"
      >
        <TextInput
          value={value}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          placeholder="Type or paste your prompt..."
        />
      </Box>
    </Box>
  );
};