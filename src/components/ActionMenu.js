import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	AccountBox,
	Create,
	DeleteForever,
	Mail,
	MoreVert,
} from '@material-ui/icons';
import {
	IconButton,
	ListItemIcon,
	makeStyles,
	Menu,
	MenuItem,
	Typography,
} from '@material-ui/core';

import { useDialogContext } from '../components/GlobalDialog';
import DeleteDialog from '../components/DeleteDialog';
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
	student: { id, phoneNumber, publicProfileId, firstName, lastName, email },
	onEdited,
	onDeleted,
}) => {
	const { deleteStudent, editStudent } = useApi();
	const history = useHistory();
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
								onSubmit: editedStudent =>
									editStudent(id, editedStudent).then(
										onEdited
									),
							});
						},
					},
					{
						icon: <AccountBox />,
						label: 'View Student Profile Page',
						onClick: () =>
							history.push(`/students/${publicProfileId}`),
					},
					{
						icon: <Mail />,
						label: 'Send Student Profile URL',
						onClick: () =>
							(window.location.href = `mailto:${email}?subject=Personal Profile&body=This a link to your personal profile where you can view upcoming lessons, practice notes and announcements. Please bookmark this link \n ${window.location.origin}/students/${publicProfileId}`),
					},
					{
						icon: <DeleteForever />,
						label: `Delete ${firstName}`,
						onClick: () =>
							showDialog(DeleteDialog, {
								withInput: true,
								onDelete: () =>
									deleteStudent(id).then(() =>
										onDeleted({ id })
									),
							}),
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
