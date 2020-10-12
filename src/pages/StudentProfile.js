import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { useParams } from 'react-router-dom';

import Calendar from '../components/Calendar';
import Page from '../components/Page';
import PracticeBook from '../components/PracticeBook';
import Note from '../components/Note';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';
import GridContainer from '../components/GridContainer';

const StudentProfile = () => {
	const { publicProfileId } = useParams();
	const { editPracticeNote, getStudent, createPracticeNote } = useApi();
	const {
		loading,
		data: {
			Announcements = [],
			Events,
			firstName,
			id,
			lastName,
			PracticeNotes,
		} = {},
		setData,
	} = useOnMount(() => getStudent(publicProfileId));
	const theme = useTheme();
	const upMd = useMediaQuery(theme.breakpoints.up('md'));

	return (
		<Page loading={loading}>
			<Typography variant="h2" align="center" gutterBottom>
				{firstName} {lastName}
			</Typography>
			<GridContainer columns={upMd ? 2 : 1}>
				<div>
					<Typography variant="h5" gutterBottom>
						Practice Book
					</Typography>
					<PracticeBook
						practiceNotes={PracticeNotes}
						onCreate={practiceNote =>
							createPracticeNote({
								...practiceNote,
								StudentId: id,
							}).then(practiceNote =>
								setData(({ PracticeNotes, ...data }) => ({
									...data,
									PracticeNotes: [
										...PracticeNotes,
										practiceNote,
									],
								}))
							)
						}
						onEdit={practiceNote =>
							editPracticeNote(
								practiceNote.id,
								practiceNote
							).then(practiceNote =>
								setData(({ PracticeNotes, ...data }) => ({
									...data,
									PracticeNotes: PracticeNotes.map(note =>
										note.id === practiceNote.id
											? practiceNote
											: note
									),
								}))
							)
						}
					/>
				</div>

				<div>
					<Typography variant="h5" gutterBottom>
						Announcements
					</Typography>
					<GridContainer columns={2}>
						{Announcements.map(({ text, createdAt }) => (
							<Note text={text} date={createdAt} />
						))}
					</GridContainer>
				</div>
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
