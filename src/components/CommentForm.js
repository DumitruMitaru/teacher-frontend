import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

import { LinkedTextInput } from './TextInput';
import PrimaryButton from './PrimaryButton';

const validationSchema = yup.object().shape({
	text: yup.string().max(1000).required('Please enter a comment'),
});

const CommentForm = ({ initialValues, onSubmit }) => {
	return (
		<Formik
			initialValues={{
				text: '',
				...initialValues,
			}}
			validationSchema={validationSchema}
			onSubmit={async ({ text }, { setSubmitting, resetForm }) => {
				try {
					await onSubmit({ text });
				} catch (err) {
				} finally {
					resetForm();
					setSubmitting(false);
				}
			}}
		>
			{({ isSubmitting }) => (
				<Form>
					<LinkedTextInput
						name="text"
						label="Leave A Comment"
						multiline
					/>
					<PrimaryButton
						type="submit"
						disabled={isSubmitting}
						style={{ marginTop: 8 }}
					>
						Save
					</PrimaryButton>
				</Form>
			)}
		</Formik>
	);
};

export default CommentForm;
