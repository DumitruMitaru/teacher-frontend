import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
	Button,
	Card,
	CardContent,
	Grid,
	MobileStepper,
	Tooltip,
	Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
	Add,
	Create,
	KeyboardArrowLeft,
	KeyboardArrowRight,
} from '@material-ui/icons';

import { useDialogContext } from '../components/GlobalDialog';
import PrimaryButton from './PrimaryButton';
import PracticeNoteForm from './PracticeNoteForm';

const PracticeBook = ({ practiceNotes, onEdit, onCreate }) => {
	const [activeStep, setActiveStep] = useState(
		Math.max(practiceNotes.length - 1, 0)
	);
	const { showDialog } = useDialogContext();

	useEffect(() => {
		setActiveStep(Math.max(practiceNotes.length - 1, 0));
	}, [practiceNotes.length]);

	return (
		<Card>
			<CardContent>
				{practiceNotes.length === 0 ? (
					<Alert severity="info" style={{ minHeight: 200 }}>
						No practice notes created
					</Alert>
				) : (
					<>
						<Typography align="right">
							{format(
								parseISO(practiceNotes[activeStep].createdAt),
								'EEEE MMM do yyyy'
							)}
						</Typography>
						<Typography
							style={{ minHeight: 200, padding: 48 }}
							dangerouslySetInnerHTML={{
								__html: practiceNotes[activeStep].text,
							}}
						/>
					</>
				)}
				<Grid
					container
					justify="space-between"
					alignItems="center"
					style={{ marginTop: 16 }}
				>
					<Tooltip title="Edit Note" placement="top">
						<Button
							size="small"
							variant="outlined"
							disabled={practiceNotes.length === 0}
							onClick={() =>
								showDialog(PracticeNoteForm, {
									title: 'Edit Practice Note',
									initialValues: practiceNotes[activeStep],
									onSubmit: onEdit,
								})
							}
							startIcon={<Create />}
						>
							Edit
						</Button>
					</Tooltip>
					<PrimaryButton
						size="small"
						startIcon={<Add />}
						onClick={() =>
							showDialog(PracticeNoteForm, {
								title: 'New Practice Note',
								onSubmit: onCreate,
							})
						}
					>
						New Practice Note
					</PrimaryButton>
				</Grid>
			</CardContent>
			<MobileStepper
				steps={practiceNotes.length}
				position="static"
				variant="text"
				activeStep={activeStep}
				nextButton={
					<Button
						size="small"
						onClick={() =>
							setActiveStep(activeStep => activeStep + 1)
						}
						disabled={activeStep === practiceNotes.length - 1}
						endIcon={<KeyboardArrowRight />}
					>
						Next
					</Button>
				}
				backButton={
					<Button
						size="small"
						onClick={() =>
							setActiveStep(activeStep => activeStep - 1)
						}
						disabled={activeStep === 0}
						startIcon={<KeyboardArrowLeft />}
					>
						Back
					</Button>
				}
			/>
		</Card>
	);
};

export default PracticeBook;
