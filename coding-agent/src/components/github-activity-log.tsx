import React from "react";
import {Box, render, Text} from "ink";

type Status = "running" | "success" | "error";

type Props = {
	action: string;
	repo: string;
	branch?: string;
	status: Status;
	details?: string;
};

export default function GithubTool({
	action,
	repo,
	branch,
	status,
	details
}: Props) {

	const icon =
		status === "running" ? "…" :
		status === "success" ? "✓" : "✗";

	const iconColor =
		status === "success" ? "green" :
		status === "error" ? "red" :
		"yellow";

	return (
		<Box
			flexDirection="column"
			marginBottom={1}
			paddingX={1}
			paddingY={0}
			borderStyle="round"
			borderColor="gray"
		>
			<Box>
				<Text color={iconColor}>{icon}</Text>
				<Text> </Text>
				<Text bold color="white">{action}</Text>
				<Text dimColor> github</Text>
			</Box>

			<Box flexDirection="column" marginLeft={2} marginTop={0}>
				<Text color="white">
					<Text dimColor>repo</Text>
					<Text dimColor>: </Text>
					{repo}
				</Text>

				{branch && (
					<Text color="white">
						<Text dimColor>branch</Text>
						<Text dimColor>: </Text>
						{branch}
					</Text>
				)}

				<Text color="white">
					<Text dimColor>status</Text>
					<Text dimColor>: </Text>
					{status}
				</Text>

				{details && (
					<Text color="white">
						<Text dimColor>result</Text>
						<Text dimColor>: </Text>
						{details}
					</Text>
				)}
			</Box>
		</Box>
	);
}

render(
	<>
		<GithubTool
			action="commit"
			repo="subhraneel2005/rag-systems-lab"
			branch="main"
			status="success"
			details="Committed 3 files"
		/>

		<GithubTool
			action="push"
			repo="subhraneel2005/rag-systems-lab"
			branch="main"
			status="running"
		/>

		<GithubTool
			action="create_pr"
			repo="subhraneel2005/rag-systems-lab"
			branch="feature/rerank"
			status="success"
			details="PR #42 opened"
		/>
	</>
);