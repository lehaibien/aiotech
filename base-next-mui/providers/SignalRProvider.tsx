"use client";

import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SignalRContext = createContext<HubConnection | null>(null);

type SignalRProviderProps = {
  children: React.ReactNode;
};

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

export const SignalRProvider = ({ children }: SignalRProviderProps) => {
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const [connection, setConnection] = useState<HubConnection | null>(null);

  // Memoize the user's role
  const userRole = useMemo(() => {
    return session?.user?.role?.toLowerCase();
  }, [session]);

  const accessToken = useMemo(() => {
    return session?.user.accessToken ?? "";
  }, [session]);

  useEffect(() => {
    if (userRole === "admin") {
      const newConnection = new HubConnectionBuilder()
        .withUrl(baseUrl + "/notificationHub", {
          accessTokenFactory: async () => {
            return accessToken;
          },
          withCredentials: true,
        })
        .configureLogging(LogLevel.Error)
        .build();

      // Start the connection
      newConnection
        .start()
        .then(() => {
          // console.log("SignalR Connected");
          setConnection(newConnection);
        })
        .catch((err: Error) => {
          setConnection(null);
          console.error("SignalR Connection Error: ", err);
        });

      // Cleanup on unmount
      return () => {
        if (newConnection) {
          newConnection
            .stop()
            .then(() => console.log("SignalR Disconnected"))
            .catch((err: Error) =>
              console.error("SignalR Disconnection Error: ", err)
            );
        }
      };
    }
  }, [accessToken, userRole]); // Re-run effect if userRole changes

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveNotification", (message) => {
        enqueueSnackbar(message, {
          key: "admin-notification",
          variant: "info",
          persist: true,
          preventDuplicate: false,
          disableWindowBlurListener: false,
        });
      });

      // Cleanup on unmount
      return () => {
        connection.off("ReceiveNotification");
      };
    }
  }, [connection, enqueueSnackbar]);

  return (
    <SignalRContext.Provider value={connection}>
      {children}
    </SignalRContext.Provider>
  );
};

// Custom hook to use the SignalR connection
export const useSignalR = () => {
  return useContext(SignalRContext);
};
