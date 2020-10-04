import React from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Add } from '@material-ui/icons';
import { useSnackbar } from 'notistack';

import { PhoneNumber } from '../components/PhoneNumber';
import { useDialogContext } from '../components/GlobalDialog';
import ActionMenu from '../components/ActionMenu';
import StudentForm from '../components/StudentForm';
import Page from '../components/Page';
import PrimaryButton from '../components/PrimaryButton';
import Table from '../components/Table';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const Student = () => {
	const { enqueueSnackbar } = useSnackbar();
	const { showDialog } = useDialogContext();
	const { createStudent, getStudents, getUser } = useApi();
	const {
		loading,
		data: [user, students] = [{}, []],
		setData,
	} = useOnMount(() => Promise.all([getUser(), getStudents()]));

	return (
		<Page loading={loading}>
			<Card>
				<CardContent>
					<Box margin={8} marginTop={2}>
						<Typography variant="h4" align="center" gutterBottom>
							Welcome {user.email}
						</Typography>
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
									showDialog(StudentForm, {
										title: 'New Student',
										onSubmit: async student => {
											await createStudent(
												student
											).then(student =>
												setData([
													user,
													[student, ...students],
												])
											);
											enqueueSnackbar('Student Created!');
										},
									})
								}
							>
								New Student
							</PrimaryButton>
						</Grid>
					</Box>
					{students.length === 0 ? (
						<Alert severity="info">
							You do not have any students.
						</Alert>
					) : (
						<Table
							columns={[
								{
									title: 'First Name',
									field: 'firstName',
								},
								{
									title: 'Last Name',
									field: 'lastName',
								},
								{
									title: 'Email',
									field: 'email',
									render: ({ email }) => (
										<a href={`mailto:${email}`}>{email}</a>
									),
								},
								{
									title: 'Phone Number',
									field: 'phoneNumber',
									render: ({ phoneNumber }) => (
										<PhoneNumber value={phoneNumber} />
									),
								},
								{
									title: 'Actions',
									sorting: false,
									align: 'center',
									render: student => (
										<ActionMenu
											student={student}
											onEdited={editedStudent =>
												setData([
													user,
													students.map(student =>
														student.id ===
														editedStudent.id
															? editedStudent
															: student
													),
												])
											}
										/>
									),
								},
							]}
							data={students}
						/>
					)}
				</CardContent>
			</Card>
		</Page>
	);
};

export default Student;
