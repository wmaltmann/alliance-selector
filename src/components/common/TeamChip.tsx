import { Chip, useTheme } from "@mui/material";
import React from "react";
import { TeamCategory } from "../../model/picklist/picklist.Model";

interface TeamChipProps {
	text: string;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	teamCategory: TeamCategory;
}

const TeamChip: React.FC<TeamChipProps> = ({ text, onClick, teamCategory }) => {
	const theme = useTheme();
	let bgColor: string;
	switch (teamCategory) {
		case "pick":
			bgColor = theme.palette.chip.pick;
			break;
		case "neutral":
			bgColor = theme.palette.chip.neutral;
			break;
		case "doNotPick":
			bgColor = theme.palette.chip.doNotPick;
			break;
		default:
			bgColor = theme.palette.chip.unassigned;
			break;
	}
	return (
		<Chip
			label={text}
			onClick={onClick}
			sx={{
				bgcolor: "default",
				border: "2px solid",
				borderColor: bgColor,
				width: "32px",
				padding: "0px",
				"& .MuiChip-label": { padding: 0 },
			}}
		/>
	);
};

export default TeamChip;
