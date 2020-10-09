import React from 'react';
import { useSnackbar } from 'notistack';

import { useDialogContext } from '../components/GlobalDialog';
import EventForm from '../components/EventForm';
import Page from '../components/Page';
import Calendar from '../components/Calendar';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const CalendarPage = () => {
	const {
		bulkDeleteEvents,
		copyEvents,
		createEvent,
		editEvent,
		getEvents,
	} = useApi();
	const { showDialog } = useDialogContext();
	const { enqueueSnackbar } = useSnackbar();

	const { loading, data: events, setData: setEvents } = useOnMount(getEvents);

	return (
		<Page loading={loading}>
			<Calendar
				events={events}
				onEventsDelete={eventsToDeleteIds => {
					enqueueSnackbar('Deleting Events...', { variant: 'info' });
					bulkDeleteEvents(eventsToDeleteIds).then(() => {
						setEvents(events =>
							events.filter(
								event => !eventsToDeleteIds.includes(event.id)
							)
						);
						enqueueSnackbar('Events Deleted');
					});
				}}
				onEventDateChange={editedEvent => {
					enqueueSnackbar('Saving...', { variant: 'info' });
					editEvent(editedEvent.id, editedEvent).then(() => {
						setEvents(events =>
							events.map(event =>
								event.id === editedEvent.id
									? editedEvent
									: event
							)
						);
						enqueueSnackbar('Event Edited');
					});
				}}
				onEventClick={event => {
					showDialog(EventForm, {
						title: `Edit Event: ${event.title}`,
						initialValues: event,
						onSubmit: editedEvent => {
							return editEvent(editedEvent.id, editedEvent).then(
								() => {
									setEvents(events =>
										events.map(event =>
											event.id === editedEvent.id
												? editedEvent
												: event
										)
									);
									enqueueSnackbar('Event Edited');
								}
							);
						},
					});
				}}
				onEventCreate={event => {
					showDialog(EventForm, {
						title: 'Create New Event',
						initialValues: event,
						onSubmit: event => {
							return createEvent(event).then(() => {
								setEvents(events => [...events, event]);
								enqueueSnackbar('Event Created');
							});
						},
					});
				}}
				onEventsPaste={copiedEvents => {
					enqueueSnackbar('Saving...', { variant: 'info' });
					copyEvents(copiedEvents).then(copiedEvents => {
						setEvents(events => [...events, ...copiedEvents]);
						enqueueSnackbar('Events Copied');
					});
				}}
			/>
		</Page>
	);
};

export default CalendarPage;
