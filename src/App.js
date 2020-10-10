import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { MuiThemeProvider, Grid, CircularProgress } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import {
	Auth0Provider,
	withAuthenticationRequired,
	useAuth0,
} from '@auth0/auth0-react';

import { DialogContextProvider } from './components/GlobalDialog';
import Calendar from './pages/Calendar';
import LandingPage from './pages/LandingPage';
import StudentProfile from './pages/StudentProfile';
import Students from './pages/Students';
import VerifyEmail from './pages/VerifyEmail';
import Announcements from './pages/Announcements';

import theme from './theme';

export const history = createBrowserHistory();

const onRedirectCallback = appState => {
	// Use the router's history module to replace the url
	history.replace(appState?.returnTo || window.location.pathname);
};

const Protected = ({ component }) => {
	const { error, isLoading } = useAuth0();

	if (isLoading) {
		return (
			<Grid container justify="center">
				<CircularProgress />
			</Grid>
		);
	}

	if (
		error?.error_description ===
		'Please verify your email before logging in.'
	) {
		return <VerifyEmail />;
	}

	return React.createElement(withAuthenticationRequired(component));
};

function App() {
	return (
		<Auth0Provider
			domain={process.env.REACT_APP_AUTH0_DOMAIN}
			clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
			redirectUri={`${window.location.origin}/profile`}
			audience={process.env.REACT_APP_AUTH0_API_ID}
			onRedirectCallback={onRedirectCallback}
		>
			<SnackbarProvider
				maxSnack={3}
				autoHideDuration={3000}
				variant="success"
			>
				<MuiThemeProvider theme={theme}>
					<DialogContextProvider>
						<Router history={history}>
							<Switch>
								<Route path="/students" exact>
									<Protected component={Students} />
								</Route>
								<Route path="/calendar" exact>
									<Protected component={Calendar} />
								</Route>
								<Route path="/announcements" exact>
									<Protected component={Announcements} />
								</Route>
								<Route
									component={StudentProfile}
									path="/students/:publicProfileId"
									exact
								/>
								<Route component={LandingPage} path="/" />
							</Switch>
						</Router>
					</DialogContextProvider>
				</MuiThemeProvider>
			</SnackbarProvider>
		</Auth0Provider>
	);
}

export default App;
