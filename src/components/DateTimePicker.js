import React from 'react';
import PropTypes from 'prop-types';
import { Cancel } from '@material-ui/icons';
import { InputAdornment, IconButton } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import {
	MuiPickersUtilsProvider,
	DateTimePicker as MUIDateTimePicker,
	DatePicker,
	TimePicker,
} from '@material-ui/pickers';

import useFormHelpers from '../hooks/useFormHelpers';

const DateTimePicker = ({
	clearable,
	dateOnly,
	icon,
	initialFocusedDate,
	maxDate,
	minDate,
	onChange,
	timeOnly,
	timezone,
	value,
	valueFormat,
	...props
}) => {
	timezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

	value = value ? utcToZonedTime(value, timezone) : null;
	minDate = minDate ? utcToZonedTime(minDate, timezone) : undefined;
	maxDate = maxDate ? utcToZonedTime(maxDate, timezone) : undefined;
	initialFocusedDate = initialFocusedDate
		? utcToZonedTime(initialFocusedDate, timezone)
		: undefined;

	const Picker = timeOnly
		? TimePicker
		: dateOnly
		? DatePicker
		: MUIDateTimePicker;

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<Picker
				value={value}
				onChange={date => {
					date = zonedTimeToUtc(date, timezone);
					onChange(valueFormat ? format(date, valueFormat) : date);
				}}
				minDate={minDate}
				maxDate={maxDate}
				initialFocusedDate={initialFocusedDate}
				fullWidth
				InputProps={{
					endAdornment:
						clearable && value ? (
							<InputAdornment position="end">
								<IconButton
									onClick={event => {
										event.stopPropagation(); // This is needed to keep the DateTimePicker from being opened
										onChange('');
									}}
								>
									<Cancel />
								</IconButton>
							</InputAdornment>
						) : undefined,
				}}
				inputProps={{
					'aria-label': props.label,
				}}
				{...props}
			/>
		</MuiPickersUtilsProvider>
	);
};

DateTimePicker.propTypes = {
	clearable: PropTypes.bool,
	dateOnly: PropTypes.bool,
	icon: PropTypes.element,
	initialFocusedDate: PropTypes.oneOfType([
		PropTypes.instanceOf(Date),
		PropTypes.string,
	]),
	label: PropTypes.string.isRequired,
	maxDate: PropTypes.oneOfType([
		PropTypes.instanceOf(Date),
		PropTypes.string,
	]),
	minDate: PropTypes.oneOfType([
		PropTypes.instanceOf(Date),
		PropTypes.string,
	]),
	timeOnly: PropTypes.bool,
	timezone: PropTypes.string,
	valueFormat: PropTypes.string,
};

const LinkedDateTimePicker = props => {
	const helpers = useFormHelpers(props);

	return <DateTimePicker {...helpers} />;
};

LinkedDateTimePicker.propTypes = {
	name: PropTypes.string.isRequired,
};

export { DateTimePicker, LinkedDateTimePicker };
