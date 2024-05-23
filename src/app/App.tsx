import { ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { autoLogin } from "../libs/AuthLib";
import { fbAuth } from "../libs/FirebaseLib";
import AboutPage from "../routes/AboutPage";
import HomePage from "../routes/HomePage";
import LoginPage from "../routes/LoginPage";
import ProfilePage from "../routes/ProfilePage";
import WelcomePage from "../routes/WelcomePage";
import { useAppContext } from "./AppContext";
import { themeLight } from "./theme";

function App() {
	const appContextData = useAppContext();
	const [user] = useAuthState(fbAuth);

	useEffect(() => {
		const authenticate = async () => {
			try {
				await autoLogin(user, appContextData);
			} catch (error) {
				// Do nothing
			}
		};
		void authenticate();
	}, [user]);

	return (
		<ThemeProvider theme={themeLight}>
			<Router>
				<Routes>
					{appContextData.user ? (
						<>
							<Route path="/about" element={<AboutPage />} />
							<Route path="/profile" element={<ProfilePage />} />
							<Route path="*" element={<HomePage />} />
						</>
					) : (
						<>
							<Route path="/login" element={<LoginPage />} />
							<Route path="/about" element={<AboutPage />} />
							<Route path="*" element={<WelcomePage />} />
						</>
					)}
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;
