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

		const config = { headers: { Authorization: `Bearer ${token}` } };
		const url = getUrl(endpoint);
		const restArgs =
			method === 'get' || method === 'delete' ? [config] : [body, config];

		return axios[method](url, ...restArgs)
			.then(response => response.data)
			.catch(err => {
				console.error(err);
				enqueueSnackbar(err.message, { variant: 'error' });
				throw err;
			});
	};

	// prettier-ignore
	return {
		createEvent: event => makeRequest('post', 'event', event),
		createStudent: student => makeRequest('post', 'student', student),
		editEvent: (id, event) => makeRequest('put', `event/${id}`, event),
		editStudent: (id, student) => makeRequest('put', `student/${id}`, student),
		getEvents: () => makeRequest('get', 'event'),
		getStudents: () => makeRequest('get', 'student'),
		getUser: () => makeRequest('get', 'user'),
	};
};

export default useApi;
