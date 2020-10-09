import React from 'react';
import { Formik, Form } from 'formik';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@material-ui/core';
import * as yup from 'yup';

import { LinkedRichTextEditor } from './RichTextEditor';
import Dialog from './Dialog';
import PrimaryButton from './PrimaryButton';
import GridContainer from './GridContainer';

const validationSchema = yup.object().shape({
	text: yup.string().required('Please enter a note'),
});

const StudentForm = ({ open, onClose, title, initialValues, onSubmit }) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<Formik
				initialValues={{
					text: '',
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
								<LinkedRichTextEditor
									name="text"
									label="Note"
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
