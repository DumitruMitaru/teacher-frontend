import { createMuiTheme } from '@material-ui/core';
import { pink, blue, red } from '@material-ui/core/colors';

let theme = createMuiTheme({
	palette: {
		primary: blue,
		secondary: pink,
		error: red,
	},
});

export default theme;
