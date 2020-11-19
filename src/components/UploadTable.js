import React from 'react';
import { parseISO, format } from 'date-fns';
import { Box, Card, CardContent } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Add, Create, Visibility, DeleteForever } from '@material-ui/icons';

import { useDialogContext } from './GlobalDialog';
import DeleteDialog from './DeleteDialog';
import PrimaryButton from './PrimaryButton';
import Table from './Table';
import UploadForm from './UploadForm';
import UploadPreview from './UploadPreview';

const UploadTable = ({ uploads, onCreate, onEdit, onDelete }) => {
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
								title: 'Upload New Video, Audio or Image',
								onSubmit: onCreate,
							})
						}
					>
						Upload File
					</PrimaryButton>
				</Box>
				{uploads.length === 0 ? (
					<Alert severity="info">No files have been uploaded</Alert>
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
								title: 'Tagged Students',
								field: 'taggedStudents',
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
							{
								icon: () => <Create />,
								tooltip: 'Edit',
								onClick: (e, upload) => {
									showDialog(UploadForm, {
										title: 'Edit ' + upload.name,
										initialValues: upload,
										fileUploadDisabled: true,
										onSubmit: formData =>
											onEdit(upload.id, formData),
									});
								},
							},
							{
								icon: () => <DeleteForever color="error" />,
								tooltip: 'Delete',
								onClick: (e, upload) => {
									showDialog(DeleteDialog, {
										onDelete: () => onDelete(upload.id),
									});
								},
							},
						]}
						data={uploads.map(upload => {
							upload.uploadedBy = upload.StudentId
								? upload.Student.firstName
								: upload.User.email;
							upload.taggedStudents = upload.Students.map(
								({ firstName }) => firstName
							).join(', ');
							return upload;
						})}
					/>
				)}
			</CardContent>
		</Card>
	);
};

export default UploadTable;
