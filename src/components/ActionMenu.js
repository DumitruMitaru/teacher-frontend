import React, { useState } from 'react';
import {
	Create,
	CropFree,
	DeleteForever,
	FileCopy,
	Link,
	MoreVert,
} from '@material-ui/icons';
import {
	CircularProgress,
	IconButton,
	ListItemIcon,
	makeStyles,
	Menu,
	MenuItem,
	Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import { useDialogContext } from '../components/GlobalDialog';
import StudentForm from '../components/StudentForm';
import useApi from '../hooks/useApi';

const useStyles = makeStyles(theme => ({
	icon: {
		minWidth: 40,
	},
	menuItem: {
		minWidth: 150,
		padding: theme.spacing(1, 2),
	},
}));

const ActionMenu = ({
	student: { id, phoneNumber, firstName, lastName, email },
	onEdited,
}) => {
	const [loading, setLoading] = useState(false);
	const { editStudent } = useApi();
	const { enqueueSnackbar } = useSnackbar();
	const { showDialog } = useDialogContext();
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const openMenu = event => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};

	const closeMenu = event => {
		event.stopPropagation();
		setAnchorEl(null);
	};

	const decorateRequest = (request, successMessage) => async (...args) => {
		setLoading(true);
		await request(...args).finally(() => setLoading(false));
		enqueueSnackbar(successMessage);
	};

	if (loading) {
		return <CircularProgress size={30} />;
	}

	return (
		<>
			<IconButton onClick={openMenu}>
				<MoreVert />
			</IconButton>
			<Menu open={open} onClose={closeMenu} anchorEl={anchorEl}>
				{[
					{
						icon: <Create />,
						label: 'Edit ' + firstName,
						onClick: () => {
							showDialog(StudentForm, {
								title: 'Edit Student',
								initialValues: {
									firstName,
									lastName,
									email,
									phoneNumber,
								},
								onSubmit: decorateRequest(
									editedStudent =>
										editStudent(id, editedStudent).then(
											onEdited
										),
									'Student Edited!'
								),
							});
						},
					},
				].map(({ icon, label, onClick }) => (
					<MenuItem
						onClick={event => {
							onClick(event);
							closeMenu(event);
						}}
						className={classes.menuItem}
						key={label}
					>
						<ListItemIcon className={classes.icon}>
							{icon}
						</ListItemIcon>
						<Typography>{label}</Typography>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default ActionMenu;
