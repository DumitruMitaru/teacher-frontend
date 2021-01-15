import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useSnackbar } from 'notistack';

const useApi = () => {
	const { getAccessTokenSilently } = useAuth0();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const getUrl = endpoint =>
		`${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_DOMAIN}/${endpoint}`;

	const makeRequest = async (
		method,
		endpoint,
		body,
		{ loadingMessage, successMessage } = {}
	) => {
		const token = await getAccessTokenSilently().catch(err => {
			console.error(err);
		});

		if (!loadingMessage || !successMessage) {
			switch (method) {
				case 'put':
				case 'post':
					loadingMessage = 'Saving...';
					successMessage = 'Saved';
					break;

				case 'delete':
					loadingMessage = 'Deleting...';
					successMessage = 'Deleted';
					break;
				default:
					break;
			}
		}

		let loadingNotificationKey;

		if (loadingMessage) {
			loadingNotificationKey = enqueueSnackbar(loadingMessage, {
				variant: 'info',
				persist: true,
			});
		}

		return axios({
			method,
			url: getUrl(endpoint),
			data: body,
			headers: { Authorization: `Bearer ${token}` },
		})
			.then(response => {
				closeSnackbar(loadingNotificationKey);
				if (successMessage) {
					enqueueSnackbar(successMessage);
				}
				return response.data;
			})
			.catch(err => {
				console.error(err);
				closeSnackbar(loadingNotificationKey);
				enqueueSnackbar(err.message, { variant: 'error' });
				throw err;
			});
	};

	// prettier-ignore
	return {
		bulkDeleteEvents: eventIds => makeRequest('delete', `event/bulk`, eventIds),
		copyEvents: events => makeRequest('post', 'event/copy', events),
		createAnnouncement: announcement => makeRequest('post', 'announcement', announcement),
		createComment: comment => makeRequest('post', 'comment', comment),
		createEvent: event => makeRequest('post', 'event', event),
		createPracticeNote: note => makeRequest('post', `practice-note`, note),
		createStudent: student => makeRequest('post', 'student', student),
		createUpload: upload => makeRequest('post', 'upload', upload),
		deleteAnnouncement: id => makeRequest('delete', `announcement/${id}`),
		deleteEvent: id => makeRequest('delete', `event/${id}`),
		deleteStudent: id => makeRequest('delete', `student/${id}`),
		deleteUpload: id => makeRequest('delete', `upload/${id}`),
		editAnnouncement: (id, announcement) => makeRequest('put', `announcement/${id}`, announcement),
		editEvent: (id, event) => makeRequest('put', `event/${id}`, event),
		editPracticeNote: (id, practiceNote) => makeRequest('put', `practice-note/${id}`, practiceNote),
		editStudent: (id, student) => makeRequest('put', `student/${id}`, student),
		editUpload: (id, upload) => makeRequest('put', `upload/${id}`, upload),
		editUser: (user) => makeRequest('put', `user`, user),
		getAnnouncements: () => makeRequest('get', 'announcement'),
		getComments: (uploadId) => makeRequest('get', `upload/${uploadId}/comments`),
		getEvents: () => makeRequest('get', 'event'),
		getSignedUrl: fileType => makeRequest('get', `upload/signed-url/?fileType=${fileType}`),
		getStudents: () => makeRequest('get', 'student'),
		getUploads: () => makeRequest('get', 'upload'),
		getUser: () => makeRequest('get', 'user'),
		publicCreateComment: (publicProfileId, comment) => makeRequest('post', `public/${publicProfileId}/comment`, comment),
		publicCreateUpload: (publicProfileId, upload) => makeRequest('post', `public/${publicProfileId}/upload`, upload),
		publicDeleteUpload: (publicProfileId, id) => makeRequest('delete', `public/${publicProfileId}/upload/${id}`),
		publicEditUpload: (publicProfileId, id, upload) => makeRequest('put', `public/${publicProfileId}/upload/${id}`, upload),
		publicGetComments: (publicProfileId, uploadId) => makeRequest('get', `public/${publicProfileId}/upload/${uploadId}/comments`),
		publicGetSignedUrl: (publicProfileId, fileType) => makeRequest('get', `public/upload/signed-url/${publicProfileId}/?fileType=${fileType}`),
		publicGetStudentProfile: publicProfileId => makeRequest('get', `public/student/${publicProfileId}/profile`),
		publicGetStudents: publicProfileId => makeRequest('get', `public/student/${publicProfileId}`),
		sendAnnouncement: (id, students) => makeRequest('post', `announcement/${id}/send`, students, { loadingMessage: 'Sending...', successMessage: 'Sent' }),
	};
};

export default useApi;
