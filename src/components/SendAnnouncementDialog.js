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

import { LinkedCheckboxGroup } from './CheckboxGroup';
import Dialog from './Dialog';
import PrimaryButton from './PrimaryButton';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const validationSchema = yup.object().shape({
	students: yup.array().required('Please select at least one student'),
});

const SendAnnouncementDialog = ({ announcement, onClose, onSubmit, open }) => {
	const { getStudents, sendAnnouncement } = useApi();
	const { loading, data: students = [] } = useOnMount(getStudents);

	return (
		<Dialog open={open} onClose={onClose} loading={loading}>
			<Formik
				initialValues={{
					students: students.map(({ id }) => id),
				}}
				validationSchema={validationSchema}
				onSubmit={async ({ students }, { setSubmitting }) => {
					try {
						await sendAnnouncement(announcement.id, students);
						onClose();
					} catch (err) {
					} finally {
						setSubmitting(false);
					}
				}}
				enableReinitialize
			>
				{({ isSubmitting }) => (
					<Form>
						<DialogTitle>
							Send Announcement As Text Message
						</DialogTitle>
						<DialogContent>
							<Typography
								style={{
									marginBottom: 32,
									whiteSpace: 'pre-line',
								}}
							>
								{announcement.text}
							</Typography>
							<LinkedCheckboxGroup
								name="students"
								label="Send To"
								options={students.map(
									({ id, firstName, lastName }) => ({
										value: id,
										label: firstName + ' ' + lastName,
									})
								)}
							/>
						</DialogContent>
						<DialogActions>
							<PrimaryButton
								type="submit"
								disabled={isSubmitting}
							>
								Send
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

export default SendAnnouncementDialog;
