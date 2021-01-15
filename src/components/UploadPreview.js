import React from 'react';
import {
	Button,
	DialogActions,
	DialogContent,
	List,
	ListItem,
	ListItemText,
	Typography,
} from '@material-ui/core';
import { format } from 'date-fns';

import Dialog from './Dialog';
import CommentForm from './CommentForm';
import useOnMount from '../hooks/useOnMount';

const UploadPreview = ({
	upload: { id, url, type, subType },
	open,
	onClose,
	getComments,
	onCreateComment,
}) => {
	const {
		loading,
		data: comments = [],
		setData: setComments,
	} = useOnMount(() => getComments(id));

	const mime = type + '/' + subType;

	return (
		<Dialog open={open} onClose={onClose} loading={loading}>
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
				<List
					subheader={<Typography variant="h6">Comments</Typography>}
					style={{ marginBottom: 8 }}
				>
					{comments.map(({ id, text, createdAt }) => (
						<ListItem key={id} divider>
							<ListItemText
								primary={text}
								secondary={
									'Date Posted: ' +
									format(new Date(createdAt), 'M/d/Y')
								}
							/>
						</ListItem>
					))}
				</List>
				<CommentForm
					onSubmit={comment =>
						onCreateComment({
							UploadId: id,
							...comment,
						}).then(createdComment =>
							setComments(comments => [
								...comments,
								createdComment,
							])
						)
					}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
};

export default UploadPreview;
