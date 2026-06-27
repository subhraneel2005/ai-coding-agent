import React from "react";
import { Box, render, Text } from "ink";

const blob = [
  " █▛███▜█ ",
  "▝▜█████▛▘",
  "  ▘▘ ▝▝    ",
];

let user = "subhraneel"

const blobLineColors = ["white", "yellowBright", "yellowBright"] as const;

export function BlobFigure() {
  return (
    <Box flexDirection="column">
      {blob.map((line, i) => (
        <Text key={i} color={blobLineColors[i]}>
          {line}
        </Text>
      ))}
    </Box>
  );
}

export default function Blob() {
  return (
    <Box flexDirection="column" padding={1}>
      <Box flexDirection="column" marginBottom={1}>
        <Text bold>
          Welcome {user}
        </Text>
        <Text dimColor>Your coding companion is ready.</Text>
      </Box>
      {/* Removed the surrounding box with border */}
      <BlobFigure />
    </Box>
  );
}

const isEntry = (import.meta as ImportMeta & { readonly main?: boolean }).main;
if (isEntry) {
  render(<Blob />);
}