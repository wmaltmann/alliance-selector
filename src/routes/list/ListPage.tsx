import { Stack, Typography } from "@mui/material";
import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../app/AppContext";
import FloatingButton from "../../components/common/FloatingButton";
import TeamList from "../../components/common/TeamList";
import BottomBar from "../../components/page/BottomBar";
import Page from "../../components/page/Page";
import TopBar from "../../components/page/TopBar";
import { loadPicklist } from "../../model/picklist/picklist.Manager";

const ListPage: FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const {
		lists: { activePicklist, setActivePicklistId, activePicklistId },
	} = useAppContext();
	useEffect(() => {
		loadPicklist(location, setActivePicklistId);
	}, [location]);

	const handleBackOnClick = () => {
		setActivePicklistId("");
		navigate(`/lists`, { replace: true });
	};

	const handleAddTeam = () => {
		navigate(`/${activePicklistId}/addteam`);
	};

	return (
		<>
			<TopBar onClickBack={handleBackOnClick} />
			<Page>
				<Stack width="100%" paddingBottom="60px" paddingTop="60px">
					{activePicklist?.teams ? (
						<TeamList picklist={activePicklist} />
					) : (
						<Typography>List not found or user missing permissions</Typography>
					)}
				</Stack>
				{(activePicklist?.permission || "") === "owner" && (
					<FloatingButton text="Add Team" bottomMenu extended onClick={handleAddTeam} />
				)}
			</Page>
			<BottomBar />
		</>
	);
};

export default ListPage;
