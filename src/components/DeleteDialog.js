import React from 'react';
import { Formik, Form } from 'formik';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from '@material-ui/core';

import * as yup from 'yup';

import { LinkedTextInput } from './TextInput';
import DeleteButton from './DeleteButton';
import Dialog from './Dialog';
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
							{withInput && (
								<GridContainer>
									<LinkedTextInput
										name="text"
										label=""
										placeholder="DELETE"
									/>
								</GridContainer>
							)}
						</DialogContent>
						<DialogActions>
							<DeleteButton
								type="submit"
								disabled={isSubmitting}
							/>
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
