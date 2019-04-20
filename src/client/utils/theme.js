import { createMuiTheme } from '@material-ui/core/styles';

const darkTheme = {
  palette: {
    type: 'dark',
  },
  typography: {
    useNextVariants: true,
  },
};

const lightTheme = {
  palette: {
    type: 'light',
  },
  typography: {
    useNextVariants: true,
  },
};

const getLightTheme = createMuiTheme(lightTheme);
const getDarkTheme = createMuiTheme(darkTheme);

export { getLightTheme, getDarkTheme };
