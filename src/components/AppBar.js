import React, { useState } from 'react';
import {
	AppBar as MUIAppBar,
	Button,
	Divider,
	Drawer,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
	Toolbar,
} from '@material-ui/core';
import {
	Announcement,
	CloudUpload,
	ContactMail,
	EventNote,
	Menu,
	People,
} from '@material-ui/icons';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	drawerPaper: {
		width: 240,
	},
	toolbar: theme.mixins.toolbar,
}));

const AppBar = props => {
	const classes = useStyles();
	const history = useHistory();

	const [drawerOpen, setDrawerOpen] = useState(false);
	const { logout, isAuthenticated, loginWithRedirect } = useAuth0();
	return (
		<>
			<MUIAppBar position="static">
				<Toolbar>
					<Grid container justify="space-between">
						<IconButton
							onClick={() => setDrawerOpen(open => !open)}
							edge="start"
							color="inherit"
							aria-label="menu"
							disabled={!isAuthenticated}
						>
							<Menu />
						</IconButton>
						{isAuthenticated ? (
							<Button
								color="inherit"
								onClick={() =>
									logout({
										returnTo: window.location.origin,
									})
								}
							>
								Logout
							</Button>
						) : (
							<Button color="inherit" onClick={loginWithRedirect}>
								Login
							</Button>
						)}
					</Grid>
				</Toolbar>
			</MUIAppBar>
			<Drawer
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				classes={{ paper: classes.drawerPaper }}
			>
				<div className={classes.toolbar} />
				<Divider />
				<List>
					{[
						['/account', 'Account', ContactMail],
						['/students', 'Students', People],
						['/calendar', 'Calendar', EventNote],
						['/announcements', 'Announcements', Announcement],
						['/uploads', 'Uploads', CloudUpload],
					].map(([pathname, title, Icon]) => (
						<ListItem
							key={pathname}
							onClick={() => history.push(pathname)}
							selected={history.location.pathname === pathname}
							button
						>
							<ListItemIcon>
								<Icon />
							</ListItemIcon>
							<ListItemText primary={title} />
						</ListItem>
					))}
				</List>
			</Drawer>
		</>
	);
};

export default AppBar;
