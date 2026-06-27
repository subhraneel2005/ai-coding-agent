import React, { useState } from "react";
import { Box, render, Text } from "ink";
import SelectInput from "ink-select-input";

import { OPENROUTER_FREE_MODELS } from "../../free-models";

type Item = {
	label: string;
	value: string;
};

export default function ModelSelect() {
	const [selectedModel, setSelectedModel] = useState<string | null>(null);

	const items: Item[] = OPENROUTER_FREE_MODELS.map((m: string) => ({
		label: m,
		value: m
	}));

	const handleSelect = (item: Item) => {
		setSelectedModel(item.value);
	};

	if (selectedModel) {
		return (
			<Box
				flexDirection="column"
				borderStyle="round"
				borderColor="green"
				paddingX={1}
			>
				<Text color="green">✓ Model Selected</Text>

				<Text color="white">
					<Text dimColor>model:</Text> {selectedModel}
				</Text>

				<Text color="white">
					<Text dimColor>client:</Text> openrouter.chat()
				</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold color="white">Select Model</Text>
				<Text dimColor> (↑ ↓ navigate • enter select)</Text>
			</Box>

			<Box
				borderStyle="round"
				borderColor="gray"
				height={8}
				paddingX={1}
				flexDirection="column"
			>
				<SelectInput
					items={items}
					onSelect={handleSelect}
					limit={6}
					indicatorComponent={({ isSelected }) => (
						<Text color={isSelected ? "cyan" : "white"}>
							{isSelected ? "❯" : " "}
						</Text>
					)}
					itemComponent={({ label, isSelected }) => (
						<Text color="white" inverse={isSelected}>
							{label}
						</Text>
					)}
				/>
			</Box>
		</Box>
	);
}

render(<ModelSelect />);