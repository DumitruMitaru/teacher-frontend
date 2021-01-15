import React from 'react';
import {
	Switch as MUISwitch,
	FormControlLabel,
	FormHelperText,
} from '@material-ui/core';

const Switch = ({ label, value, onChange, onHelperText, offHelperText }) => {
	return (
		<>
			<FormControlLabel
				control={
					<MUISwitch
						checked={value}
						onChange={e => onChange(e.target.checked)}
					/>
				}
				label={label}
			/>
			{onHelperText && offHelperText && (
				<FormHelperText>
					{value ? onHelperText : offHelperText}
				</FormHelperText>
			)}
		</>
	);
};

export default Switch;
