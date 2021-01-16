import React from 'react';
import {
	Button,
	DialogActions,
	DialogContent,
	Grid,
	List,
	ListItem,
	Typography,
} from '@material-ui/core';
import { format } from 'date-fns';
import * as yup from 'yup';

import CommentForm from './CommentForm';
import Dialog from './Dialog';
import EditableTextField from './EditableTextField';

import useOnMount from '../hooks/useOnMount';

const UploadPreview = ({
	upload: { id, url, type, subType },
	open,
	onClose,
	getComments,
	onCreateComment,
	onDeleteComment,
	onEditComment,
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
					{comments.map(({ Student, User, id, text, createdAt }) => (
						<ListItem key={id} style={{ display: 'block' }}>
							<Grid
								container
								justify="space-between"
								alignItems="center"
							>
								<Typography>
									{Student ? Student.firstName : User.email}
								</Typography>
								<Typography
									variant="caption"
									component="div"
									align="right"
								>
									{format(new Date(createdAt), 'M/d/Y')}
								</Typography>
							</Grid>

							<EditableTextField
								value={text}
								validationSchema={yup
									.string()
									.max(1000)
									.required('Please enter a comment')}
								onEdit={newText =>
									onEditComment(id, {
										text: newText,
									}).then(() =>
										setComments(comments =>
											comments.map(comment =>
												comment.id === id
													? {
															...comment,
															text: newText,
													  }
													: comment
											)
										)
									)
								}
								onDelete={() =>
									onDeleteComment(id).then(() =>
										setComments(comments =>
											comments.filter(
												comment => comment.id !== id
											)
										)
									)
								}
								variant="outlined"
								multiline
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
