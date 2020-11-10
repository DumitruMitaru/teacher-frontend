import React from 'react';
import { format } from 'date-fns';
import { Formik, Form } from 'formik';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@material-ui/core';
import * as yup from 'yup';

import { LinkedMultiSelect } from './MultiSelect';
import { LinkedTextInput } from './TextInput';
import { useDialogContext } from '../components/GlobalDialog';
import DeleteButton from './DeleteButton';
import DeleteDialog from './DeleteDialog';
import Dialog from './Dialog';
import GridContainer from './GridContainer';
import PrimaryButton from './PrimaryButton';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const validationSchema = yup.object().shape({
	title: yup.string().max(100).required('Please enter a title'),
	startDate: yup.date().required('Please select a begin date'),
	endDate: yup.date().required('Please select an end date'),
	Students: yup.array().of(yup.string()),
});

const EventForm = ({
	open,
	onClose,
	title,
	initialValues = {},
	onSubmit,
	onDelete,
}) => {
	const { getStudents } = useApi();
	const { loading, data: students } = useOnMount(getStudents);
	const { showDialog } = useDialogContext();

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
				{({ values, isSubmitting }) => (
					<Form>
						<DialogTitle>{title}</DialogTitle>
						<DialogContent>
							<GridContainer>
								<LinkedTextInput name="title" />
							</GridContainer>
							<GridContainer>
								<LinkedTextInput
									value={format(
										values.startDate,
										'MMMM do h:mm a'
									)}
									name="startDate"
									disabled
								/>
								<LinkedTextInput
									name="endDate"
									value={format(
										values.endDate,
										'MMMM do h:mm a'
									)}
									disabled
								/>
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
							{onDelete && (
								<DeleteButton
									disabled={isSubmitting}
									onClick={e => {
										e.stopPropagation();
										showDialog(DeleteDialog, {
											onDelete,
										});
									}}
								/>
							)}
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
