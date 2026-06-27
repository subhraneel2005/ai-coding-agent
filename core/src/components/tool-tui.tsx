import React from "react";
import { Box, render, Text } from "ink";

type ToolStatus = "running" | "success" | "error";

type Props = {
	name: string;
	args?: Record<string, any>;
	status: ToolStatus;
	output?: string;
};

export default function ToolExecution({ name, args, status, output }: Props) {
	const color =
		status === "running" ? "yellow" :
		status === "success" ? "green" : "red";

	const icon =
		status === "running" ? "●" :
		status === "success" ? "✓" : "✕";

	return (
		<Box
			flexDirection="column"
			marginBottom={1}
			paddingX={1}
			borderStyle="round"
			borderColor="gray"
		>
			<Box>
				<Text color={color}>{icon}</Text>
				<Text> </Text>
				<Text bold color="white">{name}</Text>
				<Text dimColor> tool</Text>
				<Text dimColor> · {status}</Text>
			</Box>

			{args && (
				<Box flexDirection="column" marginLeft={2} marginTop={1}>
					<Text dimColor>args</Text>

					{Object.entries(args).map(([key, value]) => (
						<Text key={key} color="white">
							<Text dimColor>{key}</Text>
							<Text dimColor>: </Text>
							<Text color="cyan">{String(value)}</Text>
						</Text>
					))}
				</Box>
			)}

			{output && (
				<Box flexDirection="column" marginLeft={2} marginTop={1}>
					<Text dimColor>output</Text>
					<Text color="white">{output}</Text>
				</Box>
			)}
		</Box>
	);
}

render(
	<>
		<ToolExecution
			name="write_file"
			status="success"
			args={{ path: "src/app/page.tsx" }}
			output="File written successfully"
		/>

		<ToolExecution
			name="run_tests"
			status="running"
			args={{ framework: "jest" }}
		/>

		<ToolExecution
			name="edit_file"
			status="error"
			args={{ path: "utils/db.ts" }}
			output="Permission denied"
		/>
	</>
);