import React from 'react';
import { Typography } from '@material-ui/core';

import Page from '../components/Page';
import SupportEmail from '../components/SupportEmail';

const LandingPage = () => {
	return (
		<Page>
			<Typography variant="h3" gutterBottom>
				Welcome to your new fucking app !
			</Typography>
		</Page>
	);
};

export default LandingPage;
