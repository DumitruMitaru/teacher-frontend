import React from 'react';
import { red } from '@material-ui/core/colors';

import PrimaryButton from './PrimaryButton';

const DeleteButton = props => (
	<PrimaryButton style={{ backgroundColor: red[500] }} {...props}>
		Delete
	</PrimaryButton>
);

export default DeleteButton;
