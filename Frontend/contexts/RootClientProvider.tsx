"use client";

import theme from "@/lib/theme";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import MuiThemeProvider from "@mui/material/styles/ThemeProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Provider as JotaiProvider } from "jotai";
import { closeSnackbar, SnackbarProvider } from "notistack";
import { SignalRProvider } from "./SignalRProvider";
import 'dayjs/locale/vi';

export default function RootClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
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
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <SignalRProvider>
              <JotaiProvider>{children}</JotaiProvider>
            </SignalRProvider>
          </LocalizationProvider>
        </SnackbarProvider>
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
