import React from 'react';
import { Box, Grid, Typography, CircularProgress } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';

import SupportEmail from './SupportEmail';
import AppBar from './AppBar';

const Page = ({ loading, children }) => {
	return (
		<>
			<Grid
				container
				direction="column"
				justify="space-between"
				wrap="nowrap"
				style={{ minHeight: '100vh' }}
			>
				<div>
					<AppBar />
					<Box
						width="75%"
						marginTop={4}
						marginLeft="auto"
						marginRight="auto"
					>
						{loading ? (
							<Grid container justify="center">
								<CircularProgress />
							</Grid>
						) : (
							children
						)}
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
		</>
	);
};

export default Page;
