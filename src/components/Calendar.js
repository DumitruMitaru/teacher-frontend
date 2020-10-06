import React, { useState } from 'react';
import {
	parseISO,
	isWithinInterval,
	differenceInMilliseconds,
	addMilliseconds,
} from 'date-fns';
import { Grid } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Create, DeleteForever, FileCopy, PanTool } from '@material-ui/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useSnackbar } from 'notistack';

import PrimaryButton from '../components/PrimaryButton';

const Calendar = ({
	events,
	onEventClick,
	onEventCreate,
	onEventDateChange,
	onEventsDelete,
	onEventsPaste,
}) => {
	const [
		{ selectedEvents, selectedFromStartDate },
		setSelectedEvents,
	] = useState({});
	const [eventsCopied, setEventsCopied] = useState(false);
	const [mode, setMode] = useState();
	const { enqueueSnackbar } = useSnackbar();

	const eventResizeOrDrop = ({ event: resizedEvent }) => {
		onEventDateChange({
			...resizedEvent._def.extendedProps,
			startDate: resizedEvent.start,
			endDate: resizedEvent.end,
		});
	};
	events = events.map(({ startDate, endDate, ...event }) => ({
		startDate:
			typeof startDate === 'string' ? parseISO(startDate) : startDate,
		endDate: typeof endDate === 'string' ? parseISO(endDate) : endDate,
		...event,
	}));

	return (
		<>
			<Grid container justify="space-between">
				<ToggleButtonGroup
					value={mode}
					exclusive
					onChange={(_e, mode) => setMode(mode)}
				>
					<ToggleButton value="edit">
						<Create />
					</ToggleButton>
					<ToggleButton value="select">
						<PanTool />
					</ToggleButton>
				</ToggleButtonGroup>
				{mode === 'select' && selectedEvents?.length > 0 && (
					<Grid item>
						<PrimaryButton
							startIcon={<FileCopy />}
							onClick={() => {
								enqueueSnackbar('Events Copied');
								setEventsCopied(true);
							}}
						>
							Copy
						</PrimaryButton>
						<PrimaryButton
							startIcon={<DeleteForever />}
							onClick={() => {
								onEventsDelete(
									selectedEvents.map(({ id }) => id)
								);

								setSelectedEvents({});
							}}
						>
							Delete
						</PrimaryButton>
					</Grid>
				)}
			</Grid>
			<FullCalendar
				headerToolbar={{
					center: 'dayGridMonth,timeGridWeek,timeGridDay', // buttons for switching between views
				}}
				plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
				initialView="timeGridWeek"
				selectMinDistance={1}
				selectable={!!mode}
				editable={mode === 'edit'}
				selectMirror={mode === 'edit'}
				eventResize={eventResizeOrDrop}
				eventDrop={eventResizeOrDrop}
				select={({ start, end }) => {
					if (mode === 'select') {
						const selectedEvents = events.filter(({ startDate }) =>
							isWithinInterval(startDate, {
								start,
								end,
							})
								? true
								: false
						);
						setSelectedEvents({
							selectedEvents,
							selectedFromStartDate: start,
						});
					} else if (mode === 'edit') {
						onEventCreate({
							startDate: start,
							endDate: end,
						});
					}
				}}
				dateClick={({ date }) => {
					if (
						mode === 'select' &&
						eventsCopied &&
						selectedEvents?.length
					) {
						const shiftAmount = differenceInMilliseconds(
							date,
							selectedFromStartDate
						);
						const copiedEvents = selectedEvents.map(
							({ startDate, endDate, title, Students }) => ({
								title,
								Students,
								startDate: addMilliseconds(
									startDate,
									shiftAmount
								),
								endDate: addMilliseconds(endDate, shiftAmount),
							})
						);
						onEventsPaste(copiedEvents);
						setSelectedEvents({});
						setEventsCopied(false);
					}
				}}
				eventClick={
					mode === 'edit'
						? ({
								event: {
									_def: { extendedProps: event },
								},
						  }) => {
								onEventClick(event);
						  }
						: undefined
				}
				events={events.map(event => {
					return {
						id: event.id,
						title: event.title,
						start: event.startDate,
						end: event.endDate,
						extendedProps: {
							...event,
						},
					};
				})}
			/>
		</>
	);
};

Calendar.propTypes = {};

export default Calendar;
