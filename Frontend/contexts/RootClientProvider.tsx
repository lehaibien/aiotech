"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/vi";
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
    </AppRouterCacheProvider>
  );
}
