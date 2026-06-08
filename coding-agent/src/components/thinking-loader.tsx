import React, { useEffect, useState } from "react";
import { Text } from "ink";

export function ThinkingDots() {
  const frames = [
    "Thinking.  ",
    "Thinking.. ",
    "Thinking...",
  ];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 500); // change speed if you like
    return () => clearInterval(timer);
  }, []);

  return <Text color="yellow">{frames[frame]}</Text>;
}