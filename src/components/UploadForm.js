import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import * as yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { LinkedTextInput } from './TextInput';
import { LinkedFileUploadInput } from './FileUploadInput';
import { LinkedMultiSelect } from './MultiSelect';
import Dialog from './Dialog';
import GridContainer from './GridContainer';
import PrimaryButton from './PrimaryButton';
import CircularProgress from './CircularProgress';

import useOnMount from '../hooks/useOnMount';

const UploadForm = ({
	open,
	onClose,
	title,
	initialValues = {},
	onSubmit,
	fileUploadDisabled,
	getStudents,
	getSignedUrl,
}) => {
	const [uploadProgress, setUploadProgress] = useState(0);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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
						let uploadUrl, type, subType;

						if (!fileUploadDisabled) {
							const response = await getSignedUrl(file.type);
							uploadUrl = response.uploadUrl;

							const uploadingNotificationKey = enqueueSnackbar(
								'Uploading...',
								{
									variant: 'info',
									persist: true,
								}
							);
							await axios.put(response.signedUrl, file, {
								onUploadProgress: progressEvent =>
									setUploadProgress(
										Math.round(
											(progressEvent.loaded * 100) /
												progressEvent.total
										)
									),
							});
							closeSnackbar(uploadingNotificationKey);
							[type, subType] = file.type.split('/');
						}

						await onSubmit({
							type,
							subType,
							url: uploadUrl,
							name,
							description,
							taggedStudents: taggedStudentIds.map(id =>
								students.find(student => id === student.id)
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
							{!fileUploadDisabled && (
								<Alert severity="info">
									Large files may take a few minutes to
									upload. Please do not exit the application
									before the file has finished uploading.
								</Alert>
							)}
							{!fileUploadDisabled &&
								(isSubmitting ? (
									<center style={{ margin: 8 }}>
										<CircularProgress
											variant="static"
											size={50}
											value={uploadProgress}
										/>
									</center>
								) : (
									<GridContainer>
										<LinkedFileUploadInput name="file" />
									</GridContainer>
								))}
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
								disabled={isSubmitting}
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
