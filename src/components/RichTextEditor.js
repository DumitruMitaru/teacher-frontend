import React from 'react';
import PropTypes from 'prop-types';
import { FormHelperText, InputLabel, makeStyles } from '@material-ui/core';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

import useFormHelpers from '../hooks/useFormHelpers';

const useStyles = makeStyles(theme => ({
	editorError: {
		border: `2px solid ${theme.palette.error[500]}`,
	},
	label: {
		marginBottom: theme.spacing(1),
	},
}));

const RichTextEditor = ({
	error,
	helperText,
	icon,
	id,
	label,
	setValue,
	toolbar,
	...props
}) => {
	const classes = useStyles();

	return (
		<>
			<InputLabel htmlFor={id} error={error} className={classes.label}>
				{label}
			</InputLabel>
			<ReactQuill
				onChange={richTextContent => {
					const textContentOnly = richTextContent
						.replace(/<[^>]*>/g, '')
						.trim();

					// user has deleted all content; setting to empty string fixes potential validation issues
					if (textContentOnly === '') {
						setValue('');
					} else {
						setValue(richTextContent);
					}
				}}
				modules={{ toolbar }}
				id={id}
				className={`${error ? classes.editorError : ''}`}
				{...props}
			/>
			{helperText && (
				<FormHelperText error={error}>{helperText}</FormHelperText>
			)}
		</>
	);
};

RichTextEditor.propTypes = {
	error: PropTypes.bool,
	helperText: PropTypes.string,
	icon: PropTypes.element,
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	setValue: PropTypes.func.isRequired,
	toolbar: PropTypes.array,
};

RichTextEditor.defaultProps = {
	toolbar: [
		['bold', 'italic', 'underline'],
		[
			{
				list: 'ordered',
			},
			{
				list: 'bullet',
			},
		],
		[{ color: [] }, { background: [] }],
	],
};

const LinkedRichTextEditor = props => {
	const { onBlur, value, onChange, disabled, ...helpers } = useFormHelpers(
		props
	);

	return (
		<RichTextEditor
			id={props.name}
			setValue={onChange}
			onBlur={() => onBlur({ target: { name: props.name } })}
			readOnly={disabled}
			value={value || ''}
			{...helpers}
		/>
	);
};

LinkedRichTextEditor.propTypes = {
	name: PropTypes.string.isRequired,
};

export { RichTextEditor, LinkedRichTextEditor };
