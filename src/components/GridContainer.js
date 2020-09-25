import React from 'react';
import PropTypes from 'prop-types';
import { Grid, makeStyles } from '@material-ui/core';

const columnsToGridItemPropsMap = {
	1: {
		xs: 12,
	},
	2: {
		xs: 12,
		sm: 6,
	},
	3: {
		xs: 12,
		sm: 6,
		md: 4,
	},
	4: {
		xs: 12,
		sm: 6,
		md: 3,
	},
};

const useStyles = makeStyles(theme => ({
	container: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
}));

const GridContainer = ({ children, columns, className, ...props } = {}) => {
	const classes = useStyles();

	children = React.Children.toArray(children);

	let gridItemProps;

	if (typeof columns === 'number') {
		gridItemProps = columnsToGridItemPropsMap[columns];
	} else if (columns !== 'none') {
		gridItemProps =
			columnsToGridItemPropsMap[children.length] ||
			columnsToGridItemPropsMap[1];
	}

	return (
		<Grid
			container
			spacing={2}
			className={`${classes.container} ${className || ''}`}
			{...props}
		>
			{children.map((child, index) => (
				<Grid key={index} item {...gridItemProps}>
					{child}
				</Grid>
			))}
		</Grid>
	);
};

GridContainer.propTypes = {
	columns: PropTypes.oneOf(['none', 1, 2, 3, 4]),
};

export default GridContainer;
