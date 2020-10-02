import React from 'react';
import {
	format,
	addDays,
	addMinutes,
	parseISO,
	differenceInMilliseconds,
} from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import { useSnackbar } from 'notistack';

import { useDialogContext } from '../components/GlobalDialog';
import EventForm from '../components/EventForm';

import useApi from '../hooks/useApi';
import useOnMount from '../hooks/useOnMount';

const Calendar = () => {
	const { enqueueSnackbar } = useSnackbar();
	const { showDialog } = useDialogContext();
	const { getEvents, createEvent, editEvent } = useApi();

	const { loading, data: events, setData: setEvents } = useOnMount(getEvents);

	if (loading) {
		return 'Loading...';
	}

	return (
		<FullCalendar
			headerToolbar={{
				center: 'dayGridMonth,timeGridWeek,timeGridDay', // buttons for switching between views
			}}
			plugins={[
				rrulePlugin,
				timeGridPlugin,
				interactionPlugin,
				dayGridPlugin,
			]}
			initialView="timeGridWeek"
			select={({ start, end }) => {
				showDialog(EventForm, {
					title: `New Event on ${format(start, 'MMMM Lo')}`,
					initialEvent: {
						startDate: start,
						endDate: end,
					},
					onSubmit: event => {
						return createEvent(event).then(event => {
							setEvents([...events, event]);
							enqueueSnackbar('Event Created');
						});
					},
				});
			}}
			dateClick={function (arg) {
				console.log(arg.date.toUTCString());
			}}
			selectable
			selectConstraint={{
				startTime: '00:01',
				endTime: '23:59',
			}}
			selectMirror
			eventClick={({
				event: {
					_def: { extendedProps },
				},
			}) => {
				showDialog(EventForm, {
					title: `Edit Event: ${extendedProps.title}`,
					initialEvent: extendedProps,
					onSubmit: editedEvent => {
						return editEvent(extendedProps.id, editedEvent).then(
							() => {
								setEvents(
									events.map(event =>
										event.id === extendedProps.id
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
			events={events.map(event => {
				if (event.isRecurring) {
					return {
						title: event.title,
						rrule: event.rrule,
						duration: {
							milliseconds: differenceInMilliseconds(
								parseISO(event.endTime),
								parseISO(event.startTime)
							),
						},
						extendedProps: {
							...event,
						},
					};
				} else {
					return {
						title: event.title,
						start: event.startDate,
						end: event.endDate,
						extendedProps: {
							...event,
						},
					};
				}
			})}
		/>
	);
};

Calendar.propTypes = {};

export default Calendar;
