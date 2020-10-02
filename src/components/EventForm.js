import React from 'react';
import { Formik, Form } from 'formik';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
} from '@material-ui/core';
import { endOfDay, getDay } from 'date-fns';
import * as yup from 'yup';
import { RRule } from 'rrule';

import { LinkedTextInput } from './TextInput';
import Dialog from './Dialog';
import PrimaryButton from './PrimaryButton';
import { LinkedSingleSelect } from './SingleSelect';
import { LinkedCheckbox } from './Checkbox';
import { LinkedMultiSelect } from './MultiSelect';
import { LinkedDateTimePicker } from './DateTimePicker';
import GridContainer from './GridContainer';

import { dayToNameMap } from '../lib/dates';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const REPEAT_OPTIONS = startDate => [
	{
		label: 'Does not repeat',
		value: '',
	},
	{
		label: 'Daily',
		value: RRule.DAILY,
	},
	{
		label: `Every ${dayToNameMap[getDay(startDate)]}`,
		value: RRule.WEEKLY,
	},
];

const validationSchema = yup.object().shape({
	title: yup.string().max(100).required('Please enter a title'),
	startDate: yup.date().required('Please select a begin date'),
	endDate: yup.date().required('Please select an end date'),
	Students: yup.array().of(yup.string()),
	repeat: yup.number(),
	repeatUntil: yup.date(),
});

const EventForm = ({ open, onClose, title, initialEvent, onSubmit }) => {
	const { getStudents } = useApi();
	const { loading, data: students } = useOnMount(getStudents);

	let initialValues = {
		title: initialEvent.title,
		startDate: initialEvent.startDate,
		Students: initialEvent.Students.map(({ id }) => id),
	};

	if (initialEvent.isRecurring) {
		initialValues = {
			endDate: initialEvent.endTime,
			repeat: initialEvent.rrule.freq,
			repeatUntil: initialEvent.rrule.until,
			...initialValues,
		};
	} else {
		initialValues = {
			endDate: initialEvent.endDate,
			...initialValues,
		};
	}

	return (
		<Dialog open={open} onClose={onClose} loading={loading}>
			<Formik
				initialValues={{
					title: '',
					repeat: '',
					Students: [],
					...initialValues,
				}}
				validationSchema={validationSchema}
				onSubmit={async (
					{
						startDate,
						endDate,
						title,
						repeat,
						repeatUntil,
						Students,
					},
					{ setSubmitting }
				) => {
					try {
						const isRecurring = !!repeat;
						let event = {};

						if (isRecurring) {
							event = {
								isRecurring: true,
								startDate,
								endDate: repeatUntil,
								startTime: startDate,
								endTime: endDate,
								rrule: {
									dtstart: startDate,
									freq: repeat,
									until: repeatUntil,
								},
							};
						} else {
							event = {
								isRecurring: false,
								startDate,
								endDate,
							};
						}

						await onSubmit({ ...event, title, Students });
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
								<LinkedDateTimePicker name="startDate" />
								<LinkedDateTimePicker name="endDate" />
							</GridContainer>
							<GridContainer columns={2}>
								<LinkedSingleSelect
									name="repeat"
									options={REPEAT_OPTIONS(values.startDate)}
								/>
								<LinkedDateTimePicker
									name="repeatUntil"
									initialFocusedDate={endOfDay(new Date())}
									disabled={!values.repeat}
									dateOnly
									clearable
								/>
							</GridContainer>
							<GridContainer>
								<LinkedMultiSelect
									name="Students"
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
