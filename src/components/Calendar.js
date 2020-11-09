import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	parseISO,
	isWithinInterval,
	differenceInMilliseconds,
	addMilliseconds,
} from 'date-fns';
import { Grid, Tooltip, useTheme } from '@material-ui/core';
import { Alert, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Create, DeleteForever, FileCopy } from '@material-ui/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useSnackbar } from 'notistack';

import PrimaryButton from '../components/PrimaryButton';

const Calendar = ({
	disabled,
	events,
	initialView,
	onEventClick,
	onEventCreate,
	onEventDateChange,
	onEventsDelete,
	onEventsPaste,
}) => {
	const theme = useTheme();
	const [
		{ selectedEvents, selectedFromStartDate },
		setSelectedEvents,
	] = useState({});
	const [mode, setMode] = useState('edit');
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
			{!disabled && (
				<Grid
					container
					justify="space-between"
					style={{ marginBottom: 16 }}
				>
					<ToggleButtonGroup
						value={mode}
						exclusive
						onChange={(_e, mode) => {
							setMode(mode);
							setSelectedEvents({});
						}}
					>
						<ToggleButton value="edit">
							<Tooltip title="Create and edit events">
								<Create />
							</Tooltip>
						</ToggleButton>
						<ToggleButton value="select">
							<Tooltip title="Highlight events to copy, paste, and delete">
								<FileCopy />
							</Tooltip>
						</ToggleButton>
					</ToggleButtonGroup>
					{mode === 'select' && selectedEvents?.length > 0 && (
						<Grid container item style={{ width: 'auto' }}>
							<Alert severity="info">
								Click on a date to duplicate the selected
								events.
							</Alert>
							<PrimaryButton
								style={{
									marginLeft: 8,
									backgroundColor: theme.palette.error[500],
								}}
								startIcon={<DeleteForever />}
								onClick={() => {
									onEventsDelete(
										selectedEvents.map(({ id }) => id)
									);

									setSelectedEvents({});
								}}
							>
								Delete Events
							</PrimaryButton>
						</Grid>
					)}
				</Grid>
			)}
			<FullCalendar
				headerToolbar={{
					center: 'dayGridMonth,timeGridWeek,timeGridDay', // buttons for switching between views
				}}
				plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
				initialView={initialView}
				selectMinDistance={1}
				selectable={!!mode && !disabled}
				editable={mode === 'edit' && !disabled}
				slotDuration="00:15:00"
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
						if (selectedEvents.length > 0) {
							setSelectedEvents({
								selectedEvents,
								selectedFromStartDate: start,
							});
							enqueueSnackbar('Events Copied!');
						}
					} else if (mode === 'edit') {
						onEventCreate({
							startDate: start,
							endDate: end,
						});
					}
				}}
				dateClick={({ date }) => {
					if (mode === 'select' && selectedEvents?.length) {
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

Calendar.propTypes = {
	disabled: PropTypes.bool,
	events: PropTypes.array,
	onEventClick: PropTypes.func,
	onEventCreate: PropTypes.func,
	onEventDateChange: PropTypes.func,
	onEventsDelete: PropTypes.func,
	onEventsPaste: PropTypes.func,
	initialView: PropTypes.oneOf([
		'dayGridMonth',
		'timeGridWeek',
		'timeGridDay',
	]),
};

Calendar.defaultProps = {
	events: [],
	initialView: 'timeGridWeek',
};

export default Calendar;
