import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import Page from "../components/page/Page";
import { auth } from "../libs/FirebaseLib";

const HomePage: FC = () => {
	const [user, loading, error] = useAuthState(auth);
	const navigate = useNavigate();
	const handleLogout = async () => {
		try {
			await auth.signOut();
			console.log("Successfully logged out");
			navigate("/");
		} catch (err) {
			console.error("Error logging out:", err);
		}
	};
	const UserContent = () => (
		<>
			<button className="btn btn-secondary btn-md" onClick={handleLogout}>
				LOGOUT
			</button>
			<h3>Welcome {user?.displayName}</h3>
			<p>{user?.email}</p>
			<div className="photo">
				<img
					src={user?.photoURL ? user?.photoURL : ""}
					alt="User Display Picture"
					referrerPolicy="no-referrer"
				/>
			</div>
		</>
	);
	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error: {error.message}</div>;
	}
	return (
		<div className="box">
			{
				<Page>
					<UserContent />
				</Page>
			}
		</div>
	);
};

export default HomePage;
