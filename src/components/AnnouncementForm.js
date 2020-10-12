import React from 'react';
import { Formik, Form } from 'formik';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@material-ui/core';
import * as yup from 'yup';

import { LinkedTextInput } from './TextInput';
import Dialog from './Dialog';
import PrimaryButton from './PrimaryButton';
import GridContainer from './GridContainer';

const validationSchema = yup.object().shape({
	text: yup.string().max(1000).required('Please enter an annoucement'),
});

const AnnouncementForm = ({
	open,
	onClose,
	title,
	initialValues,
	onSubmit,
}) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<Formik
				initialValues={{
					phoneNumber: '',
					email: '',
					firstName: '',
					lastName: '',
					...initialValues,
				}}
				validationSchema={validationSchema}
				onSubmit={async (values, { setSubmitting }) => {
					try {
						await onSubmit(values);
						onClose();
					} catch (err) {
					} finally {
						setSubmitting(false);
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<DialogTitle>{title}</DialogTitle>
						<DialogContent>
							<GridContainer>
								<LinkedTextInput name="text" />
							</GridContainer>
						</DialogContent>
						<DialogActions>
							<PrimaryButton
								type="submit"
								disabled={isSubmitting}
							>
								Save
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

export default AnnouncementForm;
