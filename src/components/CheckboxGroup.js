import React from 'react';
import PropTypes from 'prop-types';
import {
	FormControl,
	FormGroup,
	FormHelperText,
	FormLabel,
} from '@material-ui/core';

import { Checkbox } from './Checkbox';
import useFormHelpers from '../hooks/useFormHelpers';

let CheckboxGroup = ({
	error,
	helperText,
	label,
	onChange,
	options,
	value: checkedOptions = [],
	...props
}) => {
	const optionIsChecked = option => checkedOptions.includes(option.value);

	return (
		<FormControl error={error} {...props}>
			<FormLabel>{label}</FormLabel>
			<FormGroup>
				{options.map(option => (
					<Checkbox
						key={option.value}
						label={option.label}
						value={optionIsChecked(option)}
						onChange={checked => {
							let newValues;
							const clickedOption = option;

							if (checked) {
								newValues = options
									.filter(
										option =>
											optionIsChecked(option) ||
											option === clickedOption
									)
									.map(option => option.value);
							} else {
								newValues = checkedOptions.filter(
									value => value !== option.value
								);
							}

							onChange(newValues);
						}}
					/>
				))}
			</FormGroup>
			{helperText && (
				<FormHelperText error={error}>{helperText}</FormHelperText>
			)}
		</FormControl>
	);
};

CheckboxGroup.propTypes = {
	error: PropTypes.bool,
	helperText: PropTypes.string,
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.array.isRequired,
	row: PropTypes.bool,
	showCheckAll: PropTypes.bool,
	value: PropTypes.array,
};

const LinkedCheckboxGroup = props => {
	const helpers = useFormHelpers(props);

	return <CheckboxGroup {...helpers} />;
};

export { CheckboxGroup, LinkedCheckboxGroup };
