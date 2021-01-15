import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import * as yup from 'yup';

import { LinkedPhoneNumberInput } from '../components/PhoneNumber';
import { TextInput } from '../components/TextInput';
import EditableTextField from '../components/EditableTextField';
import GridContainer from '../components/GridContainer';
import Page from '../components/Page';
import Switch from '../components/Switch';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const Account = () => {
	const { getUser, editUser } = useApi();
	const { loading, data: user = {}, setData: setUser } = useOnMount(getUser);

	const createEditor = fieldName => field =>
		editUser({ [fieldName]: field }).then(editedUser =>
			setUser(user => ({ ...user, ...editedUser }))
		);

	return (
		<Page loading={loading}>
			<Card>
				<CardContent>
					<GridContainer columns={2}>
						<EditableTextField
							value={user.firstName}
							onEdit={createEditor('firstName')}
							label="First Name"
							validationSchema={yup.string(50)}
						/>
						<EditableTextField
							value={user.lastName}
							onEdit={createEditor('lastName')}
							label="Last Name"
							validationSchema={yup.string(50)}
						/>
						<EditableTextField
							value={user.phoneNumber}
							onEdit={createEditor('phoneNumber')}
							label="Phone Number"
							validationSchema={yup
								.string()
								.matches(
									/^[0-9]{10}$/,
									'Please enter a valid phone number'
								)}
							LinkedInput={LinkedPhoneNumberInput}
						/>
						<TextInput value={user.email} label="Email" disabled />
						<Switch
							value={user.uploadNotifications}
							label="Notifications for Uploads"
							onHelperText="Text notifications will be sent to you whenever a student uploads a file. Please ensure that you have provided a phone number above."
							offHelperText="Text notifications will NOT be sent to you whenever a student uploads a file."
							onChange={async value => {
								// For the case that the request takes a long time, the user will see a lag when the switch is flipped
								try {
									setUser(user => ({
										...user,
										uploadNotifications: value,
									}));

									await createEditor('uploadNotifications')(
										value
									);
								} catch {
									setUser(user => ({
										...user,
										uploadNotifications: !value,
									}));
								}
							}}
						/>
					</GridContainer>
				</CardContent>
			</Card>
		</Page>
	);
};

export default Account;
