import React, { createContext, useState } from "react";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
  StyledEngineProvider,
} from "@mui/material/styles";
import { colors } from "@mui/material";

const defaultTheme = {
  colorSchemes: {
    light: {
      palette: {
        DataGrid: {
          bg: "#f8fafc",
          pinnedBg: "#f1f5f9",
          headerBg: "#eaeff5",
        },
      },
    },
    dark: {
      palette: {
        DataGrid: {
          bg: "#334155",
          pinnedBg: "#293548",
          headerBg: "#1e293b",
        },
      },
    },
  },
  palette: {
    DataGrid: {
      // Container background
      // bg: '#f8fafc',
      // Pinned rows and columns background
      // pinnedBg: '#f1f5f9',
      // Column header background
      headerBg: colors.grey[200],
    },
    mode: "light",
    primary: {
      main: "#DD9100",
      dark: colors.yellow[800],
      hover: "rgb(245, 161, 0)",
      outlineHover: colors.orange[100],
      contrastText: "#fff",
    },
    secondary: {
      main: "#2c3e50",
      light: "#95a5a6",
      dark: "#2c3e50",
      outlineHover: "#2c3e501a",
      contrastText: "#fff",
    },
    background: {
      default: "#f9f9f9",
      paper: "#fff",
    },
    warning: {
      main: "#e67e22",
      contrastText: "#fff",
      outlineHover: "#e67e221a",
    },
    info: {
      main: "#2980b9",
      contrastText: "#fff",
      outlineHover: "#2980b91a",
    },
    error: {
      main: "#e74c3c",
      contrastText: "#fff",
      outlineHover: "#e74c3c1a",
    },
    // divider: 'rgba(255, 255, 255, 0.5)',
  },
  typography: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeaders: {
          // height: 45
          color: "#000",
        },
        columnHeader: {
          // backgroundColor: colors.grey[200],
          fontSize: 14,
          fontWeight: 700,
        },
        row: {
          backgroundColor: colors.grey[100],
          fontSize: 13,
          fontWeight: 400,
          "&:hover": {
            backgroundColor: colors.grey[200],
          },
        },
      },
    },
  },
};

const isLightTheme = (theme) => theme.palette.type === "light";
const initialTheme = () => defaultTheme;
export const ThemeContext = createContext();

export function ThemeContextProvider(props) {
  const [themeState, setThemeState] = useState(() => initialTheme());

  const [expandItem, setExpandItem] = React.useState({
    Customers: false,
    "Fleet Management": false,
    Settings: false,
    "Access Management": false,
  });

  const handleToggleType = () => {
    if (isLightTheme(themeState)) {
      setThemeState({
        ...themeState,
        palette: {
          ...themeState.palette,
          mode: "dark",
          background: {
            default: "#303030",
            paper: "#424242",
          },
        },
      });
    } else {
      setThemeState({
        ...themeState,
        palette: {
          ...themeState.palette,
          type: "light",
          background: {
            default: "#f9f9f9",
            paper: "#fff",
          },
        },
      });
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        handleToggleType,
        themeState,
        setThemeState,
        expandItem,
        setExpandItem,
      }}
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={responsiveFontSizes(createTheme(themeState))}>
          {props.children}
        </ThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  );
}
