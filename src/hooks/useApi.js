import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useSnackbar } from 'notistack';

const useApi = () => {
	const { getAccessTokenSilently } = useAuth0();
	const { enqueueSnackbar } = useSnackbar();

	const getUrl = endpoint =>
		`${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_DOMAIN}/${endpoint}`;

	const makeRequest = async (method, endpoint, body) => {
		const token = await getAccessTokenSilently().catch(err => {
			console.error(err);
			enqueueSnackbar(err.message, { variant: 'error' });
			throw err;
		});

		return axios({
			method,
			url: getUrl(endpoint),
			data: body,
			headers: { Authorization: `Bearer ${token}` },
		})
			.then(response => response.data)
			.catch(err => {
				console.error(err);
				enqueueSnackbar(err.message, { variant: 'error' });
				throw err;
			});
	};

	// prettier-ignore
	return {
		bulkDeleteEvents: eventIds => makeRequest('delete', `event/bulk`, eventIds),
		copyEvents: events => makeRequest('post', 'event/copy', events),
		createEvent: event => makeRequest('post', 'event', event),
		createPracticeNote: ( note) => makeRequest('post', `practice-note`, note),
		createStudent: student => makeRequest('post', 'student', student),
		editEvent: (id, event) => makeRequest('put', `event/${id}`, event),
		editPracticeNote: (id, practiceNote) => makeRequest('put', `practice-note/${id}`, practiceNote),
		editStudent: (id, student) => makeRequest('put', `student/${id}`, student),
		getEvents: () => makeRequest('get', 'event'),
		getStudent: (id) => makeRequest('get', `student/${id}`),
		getStudents: () => makeRequest('get', 'student'),
		getUser: () => makeRequest('get', 'user'),
	};
};

export default useApi;
