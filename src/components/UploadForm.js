import React from 'react';
import { format } from 'date-fns';
import { Formik, Form } from 'formik';
import {
	Input,
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from '@material-ui/core';
import * as yup from 'yup';

import { LinkedTextInput } from './TextInput';
import { LinkedFileUploadInput } from './FileUploadInput';
import Dialog from './Dialog';
import GridContainer from './GridContainer';
import PrimaryButton from './PrimaryButton';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const UploadForm = ({
	open,
	onClose,
	title,
	initialValues = {},
	onSubmit,
	fileUploadDisabled,
}) => {
	const { getStudents } = useApi();
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
		Students: yup.array().of(yup.string()),
	});

	return (
		<Dialog open={open} onClose={onClose} loading={loading}>
			<Formik
				initialValues={{
					file: '',
					name: initialValues.name ?? '',
					description: initialValues.description ?? '',
					...initialValues,
				}}
				validationSchema={validationSchema}
				onSubmit={async (
					{ file, name, description },
					{ setSubmitting }
				) => {
					try {
						const formData = new FormData();
						formData.append('file', file);
						formData.append('name', name);
						formData.append('description', description);

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
