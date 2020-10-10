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

import { LinkedTextInput } from './TextInput';
import Dialog from './Dialog';
import PrimaryButton from './PrimaryButton';
import { LinkedMultiSelect } from './MultiSelect';
import { LinkedDateTimePicker } from './DateTimePicker';
import GridContainer from './GridContainer';

const DeleteDialog = ({ open, onClose, onDelete }) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<Formik
				initialValues={{}}
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
								This action cannot be undone.
							</Typography>
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
