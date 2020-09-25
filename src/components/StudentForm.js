import React from 'react';
import { Formik, Form } from 'formik';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
} from '@material-ui/core';
import * as yup from 'yup';

import { LinkedPhoneNumberInput } from './PhoneNumber';
import { LinkedTextInput } from './TextInput';
import Dialog from './Dialog';
import PrimaryButton from './PrimaryButton';
import GridContainer from './GridContainer';

const validationSchema = yup.object().shape({
	firstName: yup.string().max(50).required('Please enter a first name'),
	lastName: yup.string().max(50).required('Please enter a last name.'),
	email: yup
		.string()
		.email('Please enter a valid email address.')
		.required('Please enter an email address.'),
	phoneNumber: yup
		.string()
		.matches(/^[0-9]{10}$/, 'Please enter a valid phone number')
		.required('Please enter a phone number'),
});

const StudentForm = ({ open, onClose, title, initialValues, onSubmit }) => {
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
								<LinkedTextInput name="firstName" />
								<LinkedTextInput name="lastName" />
							</GridContainer>
							<GridContainer>
								<LinkedPhoneNumberInput name="phoneNumber" />
								<LinkedTextInput
									name="email"
									label="Email Address"
									type="email"
								/>
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

export default StudentForm;
