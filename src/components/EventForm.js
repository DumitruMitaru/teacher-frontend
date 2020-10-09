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
import { LinkedMultiSelect } from './MultiSelect';
import { LinkedDateTimePicker } from './DateTimePicker';
import GridContainer from './GridContainer';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const validationSchema = yup.object().shape({
	title: yup.string().max(100).required('Please enter a title'),
	startDate: yup.date().required('Please select a begin date'),
	endDate: yup.date().required('Please select an end date'),
	Students: yup.array().of(yup.string()),
});

const EventForm = ({ open, onClose, title, initialValues = {}, onSubmit }) => {
	const { getStudents } = useApi();
	const { loading, data: students } = useOnMount(getStudents);

	return (
		<Dialog open={open} onClose={onClose} loading={loading}>
			<Formik
				initialValues={{
					...initialValues,
					title: initialValues.title ?? '',
					studentIds:
						initialValues.Students?.map(
							student => student.id ?? student
						) ?? [],
				}}
				validationSchema={validationSchema}
				onSubmit={async (
					{ studentIds, ...event },
					{ setSubmitting }
				) => {
					try {
						await onSubmit({
							...event,
							Students: studentIds.map(id =>
								students.find(student => student.id === id)
							),
						});
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
								<LinkedTextInput name="title" />
							</GridContainer>
							<GridContainer>
								<LinkedDateTimePicker name="startDate" />
								<LinkedDateTimePicker name="endDate" />
							</GridContainer>
							<GridContainer>
								<LinkedMultiSelect
									name="studentIds"
									label="Students"
									options={students.map(
										({ id, firstName, lastName }) => ({
											label: firstName + ' ' + lastName,
											value: id,
										})
									)}
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

export default EventForm;