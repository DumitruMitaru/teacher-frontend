import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { IconButton, InputAdornment } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { Create, CheckCircle, Cancel } from '@material-ui/icons';
import * as yup from 'yup';

import { LinkedTextInput } from './TextInput';

const EditableTextField = ({
	value,
	onEdit,
	validationSchema,
	label,
	LinkedInput = LinkedTextInput,
}) => {
	const [disabled, setDisabled] = useState(true);

	return (
		<Formik
			initialValues={{
				value: value || '',
			}}
			validationSchema={yup.object().shape({
				value: validationSchema,
			})}
			onSubmit={async ({ value }, { setSubmitting }) => {
				try {
					await onEdit(value);
				} catch (err) {
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
									<IconButton
										onClick={() => setDisabled(false)}
									>
										<Create />
									</IconButton>
								</InputAdornment>
							) : (
								<>
									<InputAdornment position="end">
										<IconButton
											onClick={() => {
												setFieldValue(
													'value',
													value || ''
												);
												setDisabled(true);
											}}
											style={{ color: red[500] }}
											disabled={isSubmitting}
										>
											<Cancel />
										</IconButton>
										<IconButton
											type="submit"
											style={{ color: green[500] }}
											disabled={isSubmitting}
										>
											<CheckCircle />
										</IconButton>
									</InputAdornment>
								</>
							),
						}}
					/>
				</Form>
			)}
		</Formik>
	);
};

export default EditableTextField;
