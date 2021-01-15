import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { Create, CheckCircle, Cancel } from '@material-ui/icons';
import * as yup from 'yup';

import { LinkedTextInput } from './TextInput';

const EditableTextField = ({
	value: initialValue,
	onEdit,
	validationSchema,
	label,
	LinkedInput = LinkedTextInput,
	...props
}) => {
	const [disabled, setDisabled] = useState(true);

	return (
		<Formik
			initialValues={{
				value: initialValue || '',
			}}
			validationSchema={yup.object().shape({
				value: validationSchema,
			})}
			onSubmit={async ({ value }, { setSubmitting, setFieldValue }) => {
				try {
					await onEdit(value);
				} catch (err) {
					setFieldValue('value', initialValue);
				} finally {
					setSubmitting(false);
					setDisabled(true);
				}
			}}
		>
			{({ isSubmitting, setFieldValue }) => (
				<Form>
					<LinkedInput
						name="value"
						label={label}
						disabled={disabled}
						InputProps={{
							endAdornment: disabled ? (
								<InputAdornment position="end">
									<Tooltip title="Edit">
										<IconButton
											onClick={() => setDisabled(false)}
										>
											<Create />
										</IconButton>
									</Tooltip>
								</InputAdornment>
							) : (
								<>
									<InputAdornment position="end">
										<Tooltip title="Cancel">
											<IconButton
												onClick={() => {
													setFieldValue(
														'value',
														initialValue || ''
													);
													setDisabled(true);
												}}
												style={{ color: red[500] }}
												disabled={isSubmitting}
											>
												<Cancel />
											</IconButton>
										</Tooltip>
										<Tooltip title="Save">
											<IconButton
												type="submit"
												style={{ color: green[500] }}
												disabled={isSubmitting}
											>
												<CheckCircle />
											</IconButton>
										</Tooltip>
									</InputAdornment>
								</>
							),
						}}
						{...props}
					/>
				</Form>
			)}
		</Formik>
	);
};

export default EditableTextField;
