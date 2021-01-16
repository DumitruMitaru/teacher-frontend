import React from 'react';
import { Card, CardContent } from '@material-ui/core';

import Page from '../components/Page';
import UploadTable from '../components/UploadTable';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const Upload = () => {
	const {
		createComment,
		createUpload,
		deleteComment,
		deleteUpload,
		editComment,
		editUpload,
		getComments,
		getSignedUrl,
		getStudents,
		getUploads,
	} = useApi();

	const { loading, data: uploads = [], setData: setUploads } = useOnMount(
		getUploads
	);

	return (
		<Page loading={loading}>
			<Card>
				<CardContent>
					<UploadTable
						uploads={uploads}
						getStudents={getStudents}
						getComments={getComments}
						onCreateComment={createComment}
						onEditComment={editComment}
						onDeleteComment={deleteComment}
						getSignedUrl={getSignedUrl}
						onCreate={upload =>
							createUpload(upload).then(upload =>
								setUploads(uploads => [upload, ...uploads])
							)
						}
						onEdit={(id, formData) =>
							editUpload(id, formData).then(editedUpload =>
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
							deleteUpload(id).then(() =>
								setUploads(uploads =>
									uploads.filter(upload => upload.id !== id)
								)
							)
						}
					/>
				</CardContent>
			</Card>
		</Page>
	);
};

export default Upload;
