import React from 'react';
import { parseISO, format } from 'date-fns';
import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Create, Add, DeleteForever, Send } from '@material-ui/icons';

import { useDialogContext } from '../components/GlobalDialog';
import AnnouncementForm from '../components/AnnouncementForm';
import Page from '../components/Page';
import PrimaryButton from '../components/PrimaryButton';
import Table from '../components/Table';
import DeleteDialog from '../components/DeleteDialog';
import SendAnnouncementDialog from '../components/SendAnnouncementDialog';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const Announcement = () => {
	const { showDialog } = useDialogContext();
	const {
		createAnnouncement,
		getAnnouncements,
		getUser,
		editAnnouncement,
		deleteAnnouncement,
	} = useApi();
	const {
		loading,
		data: [user, announcements] = [{}, []],
		setData,
	} = useOnMount(() => Promise.all([getUser(), getAnnouncements()]));

	return (
		<Page loading={loading}>
			<Card>
				<CardContent>
					<Box margin={8} marginTop={2}>
						<Typography variant="h4" align="center" gutterBottom>
							Welcome {user.email}
						</Typography>
						<Alert severity="info">
							Only the latest 4 announcements will be shown on the
							student profile page.
						</Alert>
					</Box>
					<Box m={1}>
						<Grid
							container
							justify="flex-start"
							alignItems="center"
						>
							<PrimaryButton
								startIcon={<Add />}
								display="block"
								onClick={() =>
									showDialog(AnnouncementForm, {
										title: 'New Announcement',
										onSubmit: async announcement => {
											await createAnnouncement(
												announcement
											).then(announcement =>
												setData(
													([user, announcements]) => [
														user,
														[
															announcement,
															...announcements,
														],
													]
												)
											);
										},
									})
								}
							>
								New Announcement
							</PrimaryButton>
						</Grid>
					</Box>
					{announcements.length === 0 ? (
						<Alert severity="info">
							You have not made any announcements.
						</Alert>
					) : (
						<Table
							columns={[
								{
									title: 'announcement',
									field: 'text',
								},
								{
									title: 'Date Posted',
									field: 'createdAt',
									render: ({ createdAt }) =>
										format(
											parseISO(createdAt),
											'EEEE LL/dd/yyyy'
										),
								},
							]}
							actions={[
								{
									icon: () => <Create />,
									tooltip: 'Edit',
									onClick: (e, announcement) => {
										showDialog(AnnouncementForm, {
											initialValues: announcement,
											onSubmit: announcement =>
												editAnnouncement(
													announcement.id,
													announcement
												).then(editedAnnouncement =>
													setData(
														([
															user,
															announcements,
														]) => [
															user,
															announcements.map(
																el =>
																	el.id ===
																	editedAnnouncement.id
																		? editedAnnouncement
																		: el
															),
														]
													)
												),
										});
									},
								},
								{
									icon: () => <DeleteForever color="error" />,
									tooltip: 'Delete',
									onClick: (e, announcement) => {
										showDialog(DeleteDialog, {
											onDelete: () =>
												deleteAnnouncement(
													announcement.id
												).then(() =>
													setData(
														([
															user,
															announcements,
														]) => [
															user,

															announcements.filter(
																el =>
																	el.id !==
																	announcement.id
															),
														]
													)
												),
										});
									},
								},
								{
									icon: () => <Send />,
									tooltip: 'Send text message',
									onClick: (e, announcement) => {
										showDialog(SendAnnouncementDialog, {
											announcement,
										});
									},
								},
							]}
							data={announcements}
						/>
					)}
				</CardContent>
			</Card>
		</Page>
	);
};

export default Announcement;
