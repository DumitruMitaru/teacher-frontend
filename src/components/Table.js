import React, { forwardRef } from 'react';
import MaterialTable from 'material-table';
import {
	AddBox,
	ArrowDownward,
	Check,
	ChevronLeft,
	ChevronRight,
	Clear,
	Create,
	DeleteForever,
	DeleteOutline,
	Edit,
	FileCopy,
	FilterList,
	FirstPage,
	LastPage,
	Remove,
	SaveAlt,
	Search,
	Send,
	ViewColumn,
} from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';

// This is needed to get the proper icons to show https://github.com/mbrn/material-table/issues/51#issuecomment-508384214
// prettier-ignore
const tableIcons = {
	Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
	Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
	Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Create: forwardRef((props, ref) => <Create {...props} ref={ref} />),
	Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
	DeleteForever: forwardRef((props, ref) => <DeleteForever {...props} ref={ref} />),
	DetailPanel: forwardRef((props, ref) => ( <ChevronRight {...props} ref={ref} />)),
	Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
	Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
	FileCopy: forwardRef((props, ref) => <FileCopy {...props} ref={ref} />),
	Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
	FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
	LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
	NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
	PreviousPage: forwardRef((props, ref) => ( <ChevronLeft {...props} ref={ref} />)),
	ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
	Send: forwardRef((props, ref) => <Send {...props} ref={ref} />),
	SortArrow: forwardRef((props, ref) => ( <ArrowDownward {...props} ref={ref} />)),
	ThirdStateCheck: forwardRef((props, ref) => ( <Remove {...props} ref={ref} />)),
	ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const Table = ({ ...props }) => {
	return (
		<MaterialTable
			icons={tableIcons}
			options={{
				showTitle: false,
				debounceInterval: 300,
				emptyRowsWhenPaging: false,
				draggable: false,
				thirdSortClick: false,
				pageSize: 10,
				pageSizeOptions: [10, 25, 50],
				actionsColumnIndex: -1,
				headerStyle: {
					color: grey[500],
					fontSize: 12,
					fontWeight: 'bold',
					letterSpacing: 1,
					paddingBottom: 0,
					textTransform: 'uppercase',
					whiteSpace: 'nowrap',
				},
			}}
			components={{
				Container: props => <div {...props} />,
			}}
			{...props}
		/>
	);
};

export default Table;
