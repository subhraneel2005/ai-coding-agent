import React from "react";
import {Box, Text} from "ink";
import type { Todos } from "../types/tool-types";

type Props = {
	todos: Todos["todos"];
  };


export default function TodoList({ todos }: Props) {
	return (
		<Box
			flexDirection="column"
			borderStyle="round"
			borderColor="gray"
			paddingX={1}
		>
			<Text bold color="white">Agent Tasks</Text>

			<Box flexDirection="column" marginTop={1}>
				{todos.map((todo) => {

					const icon =
						todo.status === "completed"
							? "✓"
							: todo.status === "ongoing"
							? "●"
							: "○"

					const color =
						todo.status === "completed"
							? "green"
							: todo.status === "ongoing"
							? "yellow"
							: "white"

					return (
						<Box key={todo.id}>
							<Text color={color}>{icon}</Text>
							<Text> </Text>

							<Text
								strikethrough={todo.status === "completed"}
								color="white"
								dimColor={todo.status === "completed"}
							>
								{todo.todo}
							</Text>

							<Text dimColor>
								{" "}
								[p{todo.priority}]
							</Text>
						</Box>
					)
				})}
			</Box>
		</Box>
	)
}