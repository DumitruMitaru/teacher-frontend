import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash.uniqueid';
import {
	FormControl,
	FormHelperText,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
} from '@material-ui/core';

import useFormHelpers from '../hooks/useFormHelpers';

const useStyles = makeStyles(theme => ({
	formControl: {
		width: '100%',
	},
}));

let SingleSelect = ({
	className,
	helperText,
	label,
	options,
	...props
} = {}) => {
	const [inputId] = useState(() => uniqueId('singleSelect_'));
	const classes = useStyles();

	const defaultRenderValue = value => {
		const foundOption = options.find(option => option.value === value);
		const label = foundOption?.label ?? null;

		return <div>{label}</div>;
	};

	return (
		<FormControl className={`${classes.formControl} ${className || ''}`}>
			<InputLabel htmlFor={inputId} error={props.error}>
				{label}
			</InputLabel>
			<Select
				inputProps={{
					id: inputId,
				}}
				renderValue={defaultRenderValue}
				{...props}
			>
				{options.map(({ value, label }) => (
					<MenuItem key={value} value={value}>
						{label}
					</MenuItem>
				))}
			</Select>
			{helperText && (
				<FormHelperText error={props.error}>
					{helperText}
				</FormHelperText>
			)}
		</FormControl>
	);
};

SingleSelect.propTypes = {
	error: PropTypes.bool,
	helperText: PropTypes.string,
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.array.isRequired,
	value: PropTypes.any,
};

const LinkedSingleSelect = props => {
	const helpers = useFormHelpers(props, { getValue: e => e.target.value });

	return <SingleSelect {...helpers} />;
};

LinkedSingleSelect.propTypes = {
	name: PropTypes.string.isRequired,
};

export { LinkedSingleSelect, SingleSelect };
