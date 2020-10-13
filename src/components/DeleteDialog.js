import React from 'react';
import { Formik, Form } from 'formik';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import * as yup from 'yup';

import Dialog from './Dialog';
import PrimaryButton from './PrimaryButton';
import { LinkedTextInput } from './TextInput';
import GridContainer from './GridContainer';

const validationSchema = yup.object().shape({
	text: yup
		.string()
		.matches('DELETE')
		.required('Please type DELETE in all caps'),
});

const DeleteDialog = ({ withInput, open, onClose, onDelete }) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<Formik
				initialValues={{ text: '' }}
				validationSchema={withInput ? validationSchema : undefined}
				onSubmit={async (values, { setSubmitting }) => {
					try {
						await onDelete();
						onClose();
					} catch (err) {
					} finally {
						setSubmitting(false);
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<DialogTitle>
							Are you sure you want to delete this?
						</DialogTitle>
						<DialogContent>
							<Typography>
								{withInput &&
									'Please type DELETE in all caps in the space provided, then press the delete button. '}
								This action cannot be undone.
							</Typography>
							<GridContainer>
								<LinkedTextInput name="text" label="" />
							</GridContainer>
						</DialogContent>
						<DialogActions>
							<PrimaryButton
								type="submit"
								disabled={isSubmitting}
								style={{ backgroundColor: red[500] }}
							>
								Delete
							</PrimaryButton>
							<Button
								onClick={e => {
									e.stopPropagation();
									onClose();
								}}
							>
								Cancel
							</Button>
						</DialogActions>
					</Form>
				)}
			</Formik>
		</Dialog>
	);
};

export default DeleteDialog;
