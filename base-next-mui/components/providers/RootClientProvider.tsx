"use client";

import theme from "@/lib/theme";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import MuiThemeProvider from "@mui/material/styles/ThemeProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Provider as JotaiProvider } from "jotai";
import { closeSnackbar, SnackbarProvider } from "notistack";
import { SignalRProvider } from "./SignalRProvider";

export default function RootClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MuiThemeProvider theme={theme}>
          <InitColorSchemeScript attribute="class" />
          <CssBaseline enableColorScheme />
          <SnackbarProvider
            maxSnack={2}
            autoHideDuration={2000}
            disableWindowBlurListener
            preventDuplicate
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            action={(snackbarId) => (
              <button onClick={() => closeSnackbar(snackbarId)}>x</button>
            )}
          >
            <SignalRProvider>
              <JotaiProvider>{children}</JotaiProvider>
            </SignalRProvider>
          </SnackbarProvider>
        </MuiThemeProvider>
      </LocalizationProvider>
    </AppRouterCacheProvider>
  );
}
