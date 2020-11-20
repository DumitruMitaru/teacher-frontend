import React from 'react';
import { Button, DialogActions, DialogContent } from '@material-ui/core';

import Dialog from './Dialog';

const UploadPreview = ({ upload: { url, type, subType }, open, onClose }) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogContent>
				{type === 'image' && (
					<img src={url} width="100%" height="auto" />
				)}
				{type === 'video' && (
					<video width="100%" height="auto" controls>
						<source src={url} type={type + '/' + subType} />
					</video>
				)}
				{type === 'audio' && (
					<audio controls>
						<source src={url} type={type + '/' + subType} />
					</audio>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
};

export default UploadPreview;
