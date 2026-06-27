import React, {useState} from "react";
import {Box, render, Text, useInput} from "ink";
import Spinner from "ink-spinner";

type Props = {
	thinking: string[];
};

export default function Thinking({thinking}: Props) {
	const [collapsed, setCollapsed] = useState(false);

	useInput((input) => {
		if (input === "t") {
			setCollapsed(v => !v);
		}
	});

	return (
		<Box flexDirection="column" marginTop={1}>
			<Box>
				<Text color="yellow">
					<Spinner type="dots" />
				</Text>
				<Text> </Text>
				<Text bold>Thinking</Text>
				<Text dimColor> · press t to {collapsed ? "expand" : "collapse"}</Text>
			</Box>

			{!collapsed && (
				<Box flexDirection="column" marginLeft={2} marginTop={1}>
					{thinking.map((line, i) => (
						<Text key={i} dimColor>
							{line}
						</Text>
					))}
				</Box>
			)}
		</Box>
	);
}