import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Add } from '@material-ui/icons';
import { useSnackbar } from 'notistack';

import { PhoneNumber } from '../components/PhoneNumber';
import { useDialogContext } from '../components/GlobalDialog';
import ActionMenu from '../components/ActionMenu';
import LoadingPage from '../components/LoadingPage';
import StudentForm from '../components/StudentForm';
import Page from '../components/Page';
import PrimaryButton from '../components/PrimaryButton';
import SupportEmail from '../components/SupportEmail';
import Table from '../components/Table';

import useApi from '../hooks/useApi';

const Student = () => {
	const [students, setStudents] = useState([]);
	const [user, setUser] = useState({});
	const { enqueueSnackbar } = useSnackbar();
	const { showDialog } = useDialogContext();
	const { createStudent, getStudents, getUser } = useApi();

	useEffect(() => {
		Promise.all([getUser(), getStudents()]).then(([user, students]) => {
			setUser(user);
			setStudents(students);
		});
	}, []);

	return (
		<Page>
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
												setStudents(students => [
													student,
													...students,
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
												setStudents(students =>
													students.map(student =>
														student.id ===
														editedStudent.id
															? editedStudent
															: student
													)
												)
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
