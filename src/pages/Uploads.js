import React from 'react';
import { Card, CardContent } from '@material-ui/core';

import Page from '../components/Page';
import UploadTable from '../components/UploadTable';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const Upload = () => {
	const { createUpload, getUploads, getUser } = useApi();
	const { loading, data: uploads = [], setData: setUploads } = useOnMount(
		getUploads
	);

	return (
		<Page loading={loading}>
			<Card>
				<CardContent>
					<UploadTable
						uploads={uploads}
						onCreate={upload =>
							createUpload(upload).then(upload =>
								setUploads(uploads => [upload, ...uploads])
							)
						}
					/>
				</CardContent>
			</Card>
		</Page>
	);
};

export default Upload;
