import React from 'react';

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

	const { loading, data: events, setData: setEvents } = useOnMount(getEvents);

	return (
		<Page loading={loading}>
			<Calendar
				events={events}
				onEventsDelete={eventsToDeleteIds =>
					bulkDeleteEvents(eventsToDeleteIds).then(() =>
						setEvents(events =>
							events.filter(
								event => !eventsToDeleteIds.includes(event.id)
							)
						)
					)
				}
				onEventDateChange={editedEvent =>
					editEvent(editedEvent.id, editedEvent).then(() =>
						setEvents(events =>
							events.map(event =>
								event.id === editedEvent.id
									? editedEvent
									: event
							)
						)
					)
				}
				onEventClick={event => {
					showDialog(EventForm, {
						title: `Edit Event: ${event.title}`,
						initialValues: event,
						onSubmit: editedEvent =>
							editEvent(editedEvent.id, editedEvent).then(() =>
								setEvents(events =>
									events.map(event =>
										event.id === editedEvent.id
											? editedEvent
											: event
									)
								)
							),
					});
				}}
				onEventCreate={event =>
					showDialog(EventForm, {
						title: 'Create New Event',
						initialValues: event,
						onSubmit: event =>
							createEvent(event).then(() =>
								setEvents(events => [...events, event])
							),
					})
				}
				onEventsPaste={copiedEvents =>
					copyEvents(copiedEvents).then(copiedEvents =>
						setEvents(events => [...events, ...copiedEvents])
					)
				}
			/>
		</Page>
	);
};

export default CalendarPage;
