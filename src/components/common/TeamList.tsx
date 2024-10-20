import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { List, ListItem, useTheme } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { updatePicklistOrder } from "../../model/picklist/picklist.Manager";
import { Picklist, Team, TeamCategory } from "../../model/picklist/picklist.Model";
import TeamDivider from "./TeamDivider";
import TeamListItem from "./TeamListItem";

interface TeamListProps {
	picklist: Picklist;
}

const TeamList = memo(({ picklist }: TeamListProps) => {
	const theme = useTheme();
	const [teamList, setTeamList] = useState<Team[]>([]);

	useEffect(() => {
		const addDividers = (teams: Team[]): Team[] => {
			const result: Team[] = [];
			let dividerCount = 1;

			const categories: TeamCategory[] = ["pick", "neutral", "doNotPick", "unassigned"];

			const teamsByCategory: { [key in TeamCategory]?: Team[] } = teams.reduce(
				(acc, team) => {
					if (!acc[team.category]) {
						acc[team.category] = [];
					}
					acc[team.category]!.push(team);
					return acc;
				},
				{} as { [key in TeamCategory]?: Team[] },
			);

			for (const category of categories) {
				result.push({
					number: `D${dividerCount++}`,
					name: category,
					category: category,
					listPosition: -1,
					rank: -1,
				});
				if (teamsByCategory[category]) {
					result.push(...teamsByCategory[category]!);
				}
			}

			return result;
		};
		setTeamList(addDividers(picklist.teams));
	}, [picklist.teams]);

	const moveTeam = (arr: Team[], startIndex: number, endIndex: number): Team[] => {
		const result = [...arr];
		const [movedElement] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, movedElement);
		return result;
	};

	const updateCategory = (arr: Team[], index: number) => {
		if (index < 0 || index >= arr.length) {
			return arr;
		}

		for (let i = index - 1; i >= 0; i--) {
			if (arr[i].number.startsWith("D")) {
				arr[index].category = arr[i].category;
				break;
			}
		}

		return arr;
	};

	const removeDividers = (arr: Team[]): Team[] => {
		return arr.filter((team) => !team.number.startsWith("D"));
	};

	const updateListPositions = (arr: Team[]): Team[] => {
		return arr.map((team, index) => ({
			...team,
			listPosition: index + 1,
		}));
	};

	const moveDividerUpAndUpdateTeams = (
		arr: Team[],
		startIndex: number,
		endIndex: number,
	): Team[] => {
		const result = [...arr];
		const [movedDivider] = result.splice(startIndex, 1);

		if (!movedDivider.number.startsWith("D")) {
			throw new Error("The moved item is not a divider.");
		}

		result.splice(endIndex, 0, movedDivider);

		const newCategory = movedDivider.category;

		for (let i = endIndex + 1; i < result.length; i++) {
			if (!result[i].number.startsWith("D")) {
				result[i].category = newCategory;
			}
		}

		return result;
	};

	const moveDividerDownAndUpdateTeams = (
		arr: Team[],
		startIndex: number,
		endIndex: number,
	): Team[] => {
		const result = [...arr];
		const [movedDivider] = result.splice(startIndex, 1);

		result.splice(endIndex, 0, movedDivider);

		const newCategory = movedDivider.category;

		for (let i = endIndex; i >= startIndex; i--) {
			if (!result[i].number.startsWith("D")) {
				result[i].category = newCategory;
			}
		}
		return result;
	};

	const onDragEnd = async (result: DropResult<string>) => {
		const startIndex = result.source.index;
		const endIndex = result.destination?.index || result.source.index;
		if (startIndex === endIndex) {
			return;
		}
		if (result.draggableId.startsWith("D")) {
			if (startIndex > endIndex) {
				const newList = removeDividers(
					moveDividerUpAndUpdateTeams(teamList, startIndex, endIndex),
				);
				await updatePicklistOrder(picklist.id, newList);
			} else {
				const newList = removeDividers(
					moveDividerDownAndUpdateTeams(teamList, startIndex, endIndex),
				);
				await updatePicklistOrder(picklist.id, newList);
			}
		} else {
			const newList = updateListPositions(
				removeDividers(updateCategory(moveTeam(teamList, startIndex, endIndex), endIndex)),
			);
			await updatePicklistOrder(picklist.id, newList);
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="teamList">
				{(provided) => (
					<List ref={provided.innerRef} {...provided.droppableProps}>
						{teamList.map((team, index) => (
							<Draggable
								key={team.number}
								draggableId={String(team.number)}
								index={index}
							>
								{(provided, snapshot) => (
									<ListItem
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										sx={{
											display: "flex",
											justifyContent: "space-between",
											width: `calc(100% - ${theme.spacing(2)})`,
											margin: theme.spacing(1),
											paddingTop: theme.spacing(1),
											paddingBottom: theme.spacing(1),
											bgcolor: snapshot.isDragging
												? "background.paper"
												: "default",
											borderRadius: "20px",
										}}
									>
										{team.listPosition < 0 ? (
											<TeamDivider teamCategory={team.category} />
										) : (
											<TeamListItem team={team} />
										)}
									</ListItem>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</List>
				)}
			</Droppable>
		</DragDropContext>
	);
});

export default TeamList;
