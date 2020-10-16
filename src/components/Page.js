import React from 'react';
import { Box, Grid, CircularProgress } from '@material-ui/core';

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
			</Grid>
		</>
	);
};

export default Page;
