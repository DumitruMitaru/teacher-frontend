import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	Checkbox,
	FormControl,
	FormHelperText,
	Input,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
} from '@material-ui/core';
import uniqueId from 'lodash.uniqueid';

import useFormHelpers from '../hooks/useFormHelpers';

const useStyles = makeStyles(theme => ({
	checkedOptions: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	formControl: {
		width: '100%',
	},
}));

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: 250,
		},
	},
	variant: 'menu',
	getContentAnchorEl: null,
};

let MultiSelect = ({
	className,
	helperText,
	label,
	onChange,
	options,
	value: checkedOptions = [],
	...props
} = {}) => {
	const classes = useStyles();
	const [inputId] = useState(() => uniqueId('multiSelect_'));

	const defaultRenderValue = checkedOptions => (
		<div className={classes.checkedOptions}>
			{checkedOptions
				.map(value => options.find(option => option.value === value))
				.map(option => option.label)
				.join(', ')}
		</div>
	);

	return (
		<FormControl className={`${classes.formControl} ${className || ''}`}>
			<InputLabel htmlFor={inputId} error={props.error}>
				{label}
			</InputLabel>
			<Select
				multiple
				value={checkedOptions}
				onChange={({ target: { value: checkedOptions } }) => {
					const sortedValues = options
						.map(option => option.value)
						.filter(value => checkedOptions.includes(value));

					onChange(sortedValues);
				}}
				input={<Input id={inputId} />}
				renderValue={defaultRenderValue}
				MenuProps={MenuProps}
				{...props}
			>
				{options.map(option => (
					<MenuItem key={option.value} value={option.value}>
						<Checkbox
							checked={checkedOptions.includes(option.value)}
						/>
						{option.label}
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

MultiSelect.propTypes = {
	className: PropTypes.string,
	error: PropTypes.bool,
	helpeText: PropTypes.string,
	icon: PropTypes.element,
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.array.isRequired,
	renderValue: PropTypes.func,
	value: PropTypes.array,
};

const LinkedMultiSelect = props => {
	const helpers = useFormHelpers(props);

	return <MultiSelect {...helpers} />;
};

LinkedMultiSelect.propTypes = {
	name: PropTypes.string.isRequired,
};

export { MultiSelect, LinkedMultiSelect };
