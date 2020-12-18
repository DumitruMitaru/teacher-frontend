import React from 'react';
import { format, parseISO } from 'date-fns';
import { yellow } from '@material-ui/core/colors';
import {
	Button,
	Card,
	CardContent,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Tooltip,
	Typography,
} from '@material-ui/core';
import { Visibility } from '@material-ui/icons';

import Dialog from './Dialog';
import { useDialogContext } from './GlobalDialog';

const Note = ({ text, date }) => {
	const { showDialog } = useDialogContext();

	return (
		<>
			<Card
				style={{
					backgroundImage: `repeating-linear-gradient(${yellow[500]} 0px, ${yellow[500]} 24px, #542e0e7d 25px)`,
					height: 200,
					position: 'relative',
					width: 200,
				}}
			>
				<Tooltip title="View Announcement">
					<IconButton
						style={{
							position: 'absolute',
							right: -6,
							top: -10,
						}}
						onClick={() =>
							showDialog(props => (
								<Dialog {...props}>
									<DialogTitle>
										Announcement
										<Divider />
									</DialogTitle>
									<DialogContent>
										<Typography
											style={{ whiteSpace: 'pre-line' }}
										>
											{text}
										</Typography>
									</DialogContent>
									<DialogActions>
										<Button onClick={props.onClose}>
											Close
										</Button>
									</DialogActions>
								</Dialog>
							))
						}
					>
						<Visibility />
					</IconButton>
				</Tooltip>
				<CardContent
					style={{
						boxSizing: 'border-box',
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
						paddingBottom: 2,
						paddingTop: 30,
					}}
				>
					<Typography
						style={{
							'-webkit-box-orient': 'vertical',
							'-webkit-line-clamp': '6',
							display: '-webkit-box',
							flex: 1,
							fontWeight: 'bold',
							maxHeight: 149,
							overflow: 'hidden',
							whiteSpace: 'pre-line',
						}}
					>
						{text}
					</Typography>
					<Typography variant="caption" align="right">
						{format(parseISO(date), 'EEEE LL/dd/yyyy')}
					</Typography>
				</CardContent>
			</Card>
		</>
	);
};

export default Note;
