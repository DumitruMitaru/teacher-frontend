import React from 'react';
import PropTypes from 'prop-types';
import {
	CircularProgress,
	Dialog as MUIDialog,
	DialogContent,
	makeStyles,
	withMobileDialog,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	loading: {
		display: 'flex',
		justifyContent: 'center',
		padding: theme.spacing(3),
	},
	paper: {
		[theme.breakpoints.up('sm')]: {
			minWidth: 500,
		},
	},
}));

const Dialog = ({ children, loading, onClose, ...props }) => {
	const classes = useStyles();

	return (
		<MUIDialog
			transitionDuration={500}
			classes={{
				paper: classes.paper,
			}}
			onClose={e => {
				e.stopPropagation();
				onClose(e);
			}}
			{...props}
		>
			{loading ? (
				<DialogContent className={classes.loading}>
					<CircularProgress />
				</DialogContent>
			) : (
				children
			)}
		</MUIDialog>
	);
};

Dialog.propTypes = {
	loading: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
};

export default withMobileDialog()(Dialog);
