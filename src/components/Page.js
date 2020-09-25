import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import { useAuth0 } from '@auth0/auth0-react';

import SupportEmail from './SupportEmail';
import PrimaryButton from './PrimaryButton';

const Page = ({ children }) => {
	const { logout, isAuthenticated, loginWithRedirect } = useAuth0();
	return (
		<Grid
			container
			direction="column"
			justify="space-between"
			wrap="nowrap"
			style={{ minHeight: '100vh' }}
		>
			<div>
				<Grid container justify="flex-end" style={{ padding: 16 }}>
					{isAuthenticated ? (
						<PrimaryButton
							onClick={() =>
								logout({
									returnTo: window.location.origin,
								})
							}
						>
							Logout
						</PrimaryButton>
					) : (
						<PrimaryButton onClick={loginWithRedirect}>
							Login
						</PrimaryButton>
					)}
				</Grid>
				<Box
					width="75%"
					marginTop={4}
					marginLeft="auto"
					marginRight="auto"
				>
					{children}
				</Box>
			</div>
			<footer
				style={{
					alignItems: 'center',
					backgroundColor: pink[500],
					boxSizing: 'border-box',
					color: 'white',
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'space-around',
					marginTop: 64,
					minheight: 50,
					padding: 16,
					width: '100%',
				}}
			>
				<Typography align="center">
					Support & Feedback:{' '}
					<SupportEmail style={{ color: 'white' }} />
				</Typography>
				<Typography>
					Made with <span role="img">💙</span> in PDX
				</Typography>
			</footer>
		</Grid>
	);
};

export default Page;
