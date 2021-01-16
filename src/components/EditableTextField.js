import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { Create, CheckCircle, Cancel, DeleteForever } from '@material-ui/icons';
import * as yup from 'yup';

import { LinkedTextInput } from './TextInput';

const EditableTextField = ({
	value: initialValue,
	onEdit,
	validationSchema,
	label,
	LinkedInput = LinkedTextInput,
	onDelete,
	...props
}) => {
	const [disabled, setDisabled] = useState(true);

	const Button = ({ tooltip, color, isSubmitting, Icon, ...props }) => (
		<Tooltip title={tooltip}>
			<IconButton
				{...props}
				disabled={isSubmitting}
				style={{
					color: isSubmitting ? undefined : color,
				}}
			>
				<Icon />
			</IconButton>
		</Tooltip>
	);

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
			{({ isSubmitting, setFieldValue, setSubmitting }) => (
				<Form>
					<LinkedInput
						name="value"
						label={label}
						disabled={disabled}
						InputProps={{
							endAdornment: disabled ? (
								<InputAdornment position="end">
									<Button
										tooltip="Edit"
										onClick={() => setDisabled(false)}
										Icon={Create}
									/>
								</InputAdornment>
							) : (
								<>
									<InputAdornment position="end">
										<Button
											tooltip="Cancel"
											onClick={() => {
												setFieldValue(
													'value',
													initialValue || ''
												);
												setDisabled(true);
											}}
											isSubmitting={isSubmitting}
											Icon={Cancel}
										/>
										<Button
											tooltip="Save"
											color={green[500]}
											isSubmitting={isSubmitting}
											Icon={CheckCircle}
											type="submit"
										/>
										{onDelete && (
											<Button
												tooltip="Delete"
												color={red[500]}
												onClick={async () => {
													try {
														setSubmitting(true);
														await onDelete();
													} finally {
														setSubmitting(false);
													}
												}}
												isSubmitting={isSubmitting}
												Icon={DeleteForever}
											/>
										)}
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
