import React from 'react';
import { parseISO, format } from 'date-fns';
import { Box, Card, CardContent } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Add, Visibility } from '@material-ui/icons';

import { useDialogContext } from './GlobalDialog';
import UploadForm from './UploadForm';
import UploadPreview from './UploadPreview';
import PrimaryButton from './PrimaryButton';
import Table from './Table';

const UploadTable = ({ uploads, onCreate }) => {
	const { showDialog } = useDialogContext();

	return (
		<Card>
			<CardContent>
				<Box m={1}>
					<PrimaryButton
						startIcon={<Add />}
						display="block"
						onClick={() =>
							showDialog(UploadForm, {
								title: 'Upload New Video or Audio',
								onSubmit: onCreate,
							})
						}
					>
						Upload Video/Audio
					</PrimaryButton>
				</Box>
				{uploads.length === 0 ? (
					<Alert severity="info">No uploads</Alert>
				) : (
					<Table
						columns={[
							{
								title: 'Name',
								field: 'name',
							},
							{
								title: 'File Type',
								field: 'type',
							},
							{
								title: 'Description',
								field: 'description',
							},
							{
								title: 'Uploaded By',
								field: 'uploadedBy',
							},
							{
								title: 'Date Posted',
								field: 'createdAt',
								render: ({ createdAt }) =>
									format(
										parseISO(createdAt),
										'EEEE LL/dd/yyyy'
									),
							},
						]}
						actions={[
							{
								icon: () => <Visibility />,
								tooltip: 'View',
								onClick: (e, upload) => {
									showDialog(UploadPreview, {
										upload,
									});
								},
							},
						]}
						data={uploads.map(upload => {
							upload.uploadedBy = upload.StudentId
								? upload.Student.firstName
								: upload.User.email;
							return upload;
						})}
					/>
				)}
			</CardContent>
		</Card>
	);
};

export default UploadTable;
