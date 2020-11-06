import React from 'react';
import { format, parseISO } from 'date-fns';
import { yellow } from '@material-ui/core/colors';
import { Card, CardContent, Typography } from '@material-ui/core';

const Note = ({ text, date }) => {
	return (
		<Card
			style={{
				height: 200,
				width: 200,
				backgroundImage: `repeating-linear-gradient(${yellow[500]} 0px, ${yellow[500]} 24px, #542e0e7d 25px)`,
			}}
		>
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
						flex: 1,
						fontWeight: 'bold',
						maxHeight: 149,
						overflow: 'scroll',
					}}
				>
					{text}
				</Typography>
				<Typography variant="caption" align="right">
					{format(parseISO(date), 'EEEE LL/dd/yyyy')}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default Note;