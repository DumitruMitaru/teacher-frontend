import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
	Checkbox as MUICheckbox,
	FormControlLabel,
	FormHelperText,
	makeStyles,
} from '@material-ui/core';

import useFormHelpers from '../hooks/useFormHelpers';

const useStyles = makeStyles(theme => ({
	error: {
		color: theme.palette.error[500],
	},
	formHelperText: {
		margin: 0,
	},
}));

// we must use forwardRef to allow this to be wrapped in a Tooltip in CheckboxGroup
const Checkbox = forwardRef(
	({ checkboxProps, error, helperText, onChange, value, ...props }, ref) => {
		const classes = useStyles();

		return (
			<>
				<FormControlLabel
					control={
						<MUICheckbox
							checked={value || false}
							onChange={(event, checked) => onChange(checked)}
							{...checkboxProps}
						/>
					}
					className={error ? classes.error : undefined}
					{...props}
					ref={ref}
				/>
				{helperText && (
					<FormHelperText
						className={classes.formHelperText}
						error={error}
					>
						{helperText}
					</FormHelperText>
				)}
			</>
		);
	}
);

Checkbox.propTypes = {
	checkboxProps: PropTypes.object,
	error: PropTypes.bool,
	helperText: PropTypes.string,
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
		.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.bool,
};

Checkbox.defaultProps = {
	checkboxProps: {},
};

const LinkedCheckbox = props => {
	const helpers = useFormHelpers(props);

	return <Checkbox {...helpers} />;
};

LinkedCheckbox.propTypes = {
	name: PropTypes.string.isRequired,
};

export { Checkbox, LinkedCheckbox };
