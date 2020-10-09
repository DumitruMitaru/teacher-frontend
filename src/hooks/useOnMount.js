import { useState, useEffect } from 'react';

const useOnMount = (request, dependencies = []) => {
	const [state, setState] = useState({
		loading: true,
		data: undefined,
		error: undefined,
		refetch: fetchData,
	});

	const setData = fn =>
		setState(({ data, ...state }) => ({ ...state, data: fn(data) }));

	function fetchData() {
		setState({ ...state, loading: true });
		request()
			.then(data => {
				setState({
					...state,
					loading: false,
					data,
					setData,
					error: undefined,
				});
			})
			.catch(error => setState({ ...state, loading: false, error }));
	}

	useEffect(() => {
		fetchData();

		// This is to disable the warning that appears when dependencies aren't defined
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);

	return state;
};

export default useOnMount;
