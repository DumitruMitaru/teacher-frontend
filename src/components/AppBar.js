import React, { useState } from 'react';
import {
	makeStyles,
	Divider,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	AppBar as MUIAppBar,
	Button,
	Drawer,
	Grid,
	IconButton,
	Toolbar,
} from '@material-ui/core';
import { Announcement, EventNote, Menu, People } from '@material-ui/icons';
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
						['/students', 'Students', People],
						['/calendar', 'Calendar', EventNote],
						['/announcements', 'Announcements', Announcement],
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
