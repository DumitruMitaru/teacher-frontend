import React from 'react';
import { Formik, Form } from 'formik';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	InputAdornment,
} from '@material-ui/core';
import * as yup from 'yup';

import { LinkedPhoneNumberInput } from './PhoneNumber';
import { LinkedTextInput } from './TextInput';
import { LinkedSingleSelect } from './SingleSelect';
import Dialog from './Dialog';
import PrimaryButton from './PrimaryButton';
import GridContainer from './GridContainer';

const validationSchema = yup.object().shape({
	firstName: yup.string().max(50).required('Please enter a first name'),
	lastName: yup.string().max(50).required('Please enter a last name.'),
	email: yup.string().email('Please enter a valid email address.').nullable(),
	phoneNumber: yup
		.string()
		.matches(/^[0-9]{10}$/, 'Please enter a valid phone number')
		.required('Please enter a phone number'),
	paymentAmount: yup.number().min(0).nullable(),
	paymentInterval: yup
		.string()
		.when('paymentAmount', function (paymentAmount) {
			return !!paymentAmount
				? this.required('Please enter a payment interval')
				: this;
		})
		.nullable(),
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
					paymentAmount: '',
					paymentInterval: '',
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
							<GridContainer columns={2}>
								<LinkedTextInput name="firstName" />
								<LinkedTextInput name="lastName" />
								<LinkedPhoneNumberInput name="phoneNumber" />
								<LinkedTextInput
									name="email"
									label="Email Address"
									type="email"
								/>
								<LinkedTextInput
									name="paymentAmount"
									type="number"
									step=".01"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												$
											</InputAdornment>
										),
									}}
								/>
								<LinkedSingleSelect
									name="paymentInterval"
									options={[
										{
											label: 'None',
											value: undefined,
										},
										{
											label: 'Weekly',
											value: 'weekly',
										},
										{
											label: 'Monthly',
											value: 'monthly',
										},
									]}
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
