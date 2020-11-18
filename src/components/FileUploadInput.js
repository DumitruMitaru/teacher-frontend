import React from 'react';
import { Input, FormHelperText, Typography } from '@material-ui/core';

import PrimaryButton from './PrimaryButton';

import useFormHelpers from '../hooks/useFormHelpers';

const FileUploadInput = ({ value, helperText, error, ...props }) => {
	return (
		<div>
			<PrimaryButton component="label">
				Select File
				<Input type="file" style={{ display: 'none' }} {...props} />
			</PrimaryButton>
			{value && (
				<Typography display="inline" style={{ marginLeft: 8 }}>
					{value.name}
				</Typography>
			)}
			{helperText && (
				<FormHelperText error={error}>{helperText}</FormHelperText>
			)}
		</div>
	);
};

const LinkedFileUploadInput = props => {
	const helpers = useFormHelpers(props, { getValue: e => e.target.files[0] });

	return <FileUploadInput {...helpers} />;
};

export { LinkedFileUploadInput, FileUploadInput };
