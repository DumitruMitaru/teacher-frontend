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
import { LinkedFileUploadInput } from './FileUploadInput';
import { LinkedMultiSelect } from './MultiSelect';
import Dialog from './Dialog';
import GridContainer from './GridContainer';
import PrimaryButton from './PrimaryButton';

import useOnMount from '../hooks/useOnMount';

const UploadForm = ({
	open,
	onClose,
	title,
	initialValues = {},
	onSubmit,
	fileUploadDisabled,
	getStudents,
}) => {
	const { loading, data: students } = useOnMount(getStudents);
	const validationSchema = yup.object().shape({
		file: yup
			.mixed()
			.test('required', 'Please select a file', value =>
				fileUploadDisabled ? true : !!value
			)
			.test(
				'format',
				'Please only select video, image or audio files',
				value =>
					fileUploadDisabled
						? true
						: value &&
						  ['video', 'audio', 'image'].includes(
								value.type.split('/')[0]
						  )
			),
		name: yup.string().max(50).required('Please enter a name'),
		description: yup.string().max(1000),
		taggedStudentIds: yup.array().of(yup.string()),
	});

	return (
		<Dialog open={open} onClose={onClose} loading={loading}>
			<Formik
				initialValues={{
					file: '',
					name: initialValues.name ?? '',
					description: initialValues.description ?? '',
					taggedStudentIds:
						initialValues.taggedStudents?.map(
							student => student.id ?? student
						) ?? [],
					...initialValues,
				}}
				validationSchema={validationSchema}
				onSubmit={async (
					{ file, name, description, taggedStudentIds },
					{ setSubmitting }
				) => {
					try {
						const formData = new FormData();
						formData.append('file', file);
						formData.append('name', name);
						formData.append('description', description);
						formData.append(
							'taggedStudents',
							JSON.stringify(
								taggedStudentIds.map(id =>
									students.find(student => id === student.id)
								)
							)
						);

						await onSubmit(formData);
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
							{!fileUploadDisabled && (
								<GridContainer>
									<LinkedFileUploadInput name="file" />
								</GridContainer>
							)}
							<GridContainer>
								<LinkedTextInput name="name" />
								<LinkedTextInput name="description" />
							</GridContainer>
							<GridContainer>
								<LinkedMultiSelect
									name="taggedStudentIds"
									label="Tagged Students"
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

export default UploadForm;
