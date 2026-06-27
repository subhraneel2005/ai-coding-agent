import React, {useState, useEffect} from "react";
import {Box, render, Text, useInput} from "ink";

type Pet = {
	hunger: number;
	happiness: number;
	energy: number;
};

export default function Tamagotchi() {
	const [pet, setPet] = useState<Pet>({
		hunger: 60,
		happiness: 60,
		energy: 60
	});

	const clamp = (v: number) => Math.max(0, Math.min(100, v));

	useEffect(() => {
		const id = setInterval(() => {
			setPet(p => ({
				hunger: clamp(p.hunger - 2),
				happiness: clamp(p.happiness - 1),
				energy: clamp(p.energy - 1)
			}));
		}, 3000);

		return () => clearInterval(id);
	}, []);

	useInput((input) => {
		if (input === "f") {
			setPet(p => ({...p, hunger: clamp(p.hunger + 20)}));
		}
		if (input === "p") {
			setPet(p => ({
				...p,
				happiness: clamp(p.happiness + 20),
				energy: clamp(p.energy - 10)
			}));
		}
		if (input === "s") {
			setPet(p => ({...p, energy: clamp(p.energy + 25)}));
		}
	});

	const mood =
		pet.hunger < 30 || pet.energy < 30
			? "( -_- )"
			: pet.happiness > 70
			? "( ^_^ )"
			: "( o_o )";

	const bar = (v: number) => {
		const filled = Math.round(v / 10);
		return "█".repeat(filled) + "░".repeat(10 - filled);
	};

	return (
		<Box flexDirection="column" borderStyle="round" padding={1}>
			<Text bold>Tamagotchi</Text>

			<Box marginTop={1}>
				<Text>{mood}</Text>
			</Box>

			<Box flexDirection="column" marginTop={1}>
				<Text dimColor>Hunger   [{bar(pet.hunger)}]</Text>
				<Text dimColor>Happy    [{bar(pet.happiness)}]</Text>
				<Text dimColor>Energy   [{bar(pet.energy)}]</Text>
			</Box>

			<Box marginTop={1} flexDirection="column">
				<Text dimColor>Controls</Text>
				<Text>f → feed</Text>
				<Text>p → play</Text>
				<Text>s → sleep</Text>
			</Box>
		</Box>
	);
}

render(<Tamagotchi/>)