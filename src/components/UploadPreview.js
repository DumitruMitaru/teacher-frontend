import React from 'react';
import { Button, DialogActions, DialogContent } from '@material-ui/core';

import Dialog from './Dialog';

const UploadPreview = ({ upload: { url, type, subType }, open, onClose }) => {
	const mime = type + '/' + subType;
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogContent>
				{type === 'image' && (
					<img src={url} width="100%" height="auto" />
				)}
				{type === 'video' && (
					<video controls width="100%" height="auto" autoPlay>
						<source
							src={url}
							type={!!window.chrome ? undefined : mime}
						/>
						Sorry, your browser doesn't support embedded videos.
					</video>
				)}
				{type === 'audio' && (
					<audio controls autoPlay>
						<source
							src={url}
							type={!!window.chrome ? undefined : mime}
						/>
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
