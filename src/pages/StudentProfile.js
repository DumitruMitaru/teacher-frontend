import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Alert } from '@material-ui/lab';

import Calendar from '../components/Calendar';
import GridContainer from '../components/GridContainer';
import Note from '../components/Note';
import Page from '../components/Page';
import PracticeBook from '../components/PracticeBook';
import UploadTable from '../components/UploadTable';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const StudentProfile = () => {
	const { publicProfileId } = useParams();
	const { isAuthenticated } = useAuth0();
	const {
		createPracticeNote,
		editPracticeNote,
		publicCreateComment,
		publicCreateUpload,
		publicDeleteUpload,
		publicEditComment,
		publicEditUpload,
		publicGetComments,
		publicGetSignedUrl,
		publicGetStudentProfile,
		publicGetStudents,
	} = useApi();
	const {
		loading,
		data: {
			Announcements = [],
			Events,
			firstName,
			id,
			lastName,
			PracticeNotes,
			Uploads = [],
		} = {},
		setData,
	} = useOnMount(() => publicGetStudentProfile(publicProfileId));

	const setUploads = setter =>
		setData(data => ({
			...data,
			Uploads: setter(data.Uploads),
		}));

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
						disabled={!isAuthenticated}
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
					{Announcements.length === 0 ? (
						<Alert severity="info">
							There are no announcements
						</Alert>
					) : (
						<GridContainer columns={2}>
							{Announcements.map(({ text, createdAt }, index) => (
								<Note
									text={text}
									date={createdAt}
									key={index}
								/>
							))}
						</GridContainer>
					)}
				</div>
			</GridContainer>
			<Typography variant="h5" gutterBottom>
				Uploads
			</Typography>
			<GridContainer>
				<UploadTable
					uploads={Uploads}
					getStudents={() => publicGetStudents(publicProfileId)}
					getSignedUrl={fileType =>
						publicGetSignedUrl(publicProfileId, fileType)
					}
					getComments={uploadId =>
						publicGetComments(publicProfileId, uploadId)
					}
					onCreateComment={comment =>
						publicCreateComment(publicProfileId, comment)
					}
					onEditComment={(id, comment) =>
						publicEditComment(publicProfileId, id, comment)
					}
					canEdit={upload => upload.StudentId === id}
					onCreate={upload =>
						publicCreateUpload(
							publicProfileId,
							upload
						).then(upload =>
							setUploads(uploads => [upload, ...uploads])
						)
					}
					onEdit={(id, upload) =>
						publicEditUpload(
							publicProfileId,
							id,
							upload
						).then(editedUpload =>
							setUploads(uploads =>
								uploads.map(upload =>
									upload.id === id
										? { ...upload, ...editedUpload }
										: upload
								)
							)
						)
					}
					onDelete={id =>
						publicDeleteUpload(publicProfileId, id).then(() =>
							setUploads(uploads =>
								uploads.filter(upload => upload.id !== id)
							)
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
