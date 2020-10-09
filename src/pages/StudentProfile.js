import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Calendar from '../components/Calendar';
import Page from '../components/Page';
import PracticeBook from '../components/PracticeBook';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';
import GridContainer from '../components/GridContainer';

const StudentProfile = () => {
	const { publicProfileId } = useParams();
	const { editPracticeNote, getStudent, createPracticeNote } = useApi();
	const {
		loading,
		data: { id, firstName, lastName, PracticeNotes, Events } = {},
		setData,
	} = useOnMount(() => getStudent(publicProfileId));

	const { enqueueSnackbar } = useSnackbar();
	return (
		<Page loading={loading}>
			<Typography variant="h2" align="center" gutterBottom>
				{firstName} {lastName}
			</Typography>
			<GridContainer>
				<PracticeBook
					practiceNotes={PracticeNotes}
					onCreate={practiceNote =>
						createPracticeNote({
							...practiceNote,
							StudentId: id,
						}).then(practiceNote => {
							setData(({ PracticeNotes, ...data }) => ({
								...data,
								PracticeNotes: [...PracticeNotes, practiceNote],
							}));
							enqueueSnackbar('Practice Note Saved');
						})
					}
					onEdit={practiceNote =>
						editPracticeNote(practiceNote.id, practiceNote).then(
							practiceNote => {
								setData(({ PracticeNotes, ...data }) => ({
									...data,
									PracticeNotes: PracticeNotes.map(note =>
										note.id === practiceNote.id
											? practiceNote
											: note
									),
								}));
								enqueueSnackbar('Practice Note Saved');
							}
						)
					}
				/>
			</GridContainer>
			<GridContainer>
				<Box marginTop={4}>
					<Calendar
						events={Events}
						initialView="dayGridMonth"
						disabled
					/>
				</Box>
			</GridContainer>
		</Page>
	);
};

export default StudentProfile;
