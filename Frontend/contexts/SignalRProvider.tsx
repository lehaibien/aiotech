"use client";

import { notifications } from "@mantine/notifications";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SignalRContext = createContext<HubConnection | null>(null);

type SignalRProviderProps = {
  children: React.ReactNode;
};

export const SignalRProvider = ({ children }: SignalRProviderProps) => {
  const { data: session } = useSession();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const userRole = useMemo(() => {
    return session?.user?.role?.toLowerCase();
  }, [session]);

  const accessToken = useMemo(() => {
    return session?.user.accessToken ?? "";
  }, [session]);

  useEffect(() => {
    if (userRole === "admin") {
      const newConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:5554/" + "notificationHub", {
          accessTokenFactory: async () => {
            return accessToken;
          },
          withCredentials: true,
        })
        .configureLogging(LogLevel.Error)
        .build();

      newConnection
        .start()
        .then(() => {
          setConnection(newConnection);
        })
        .catch((err: Error) => {
          setConnection(null);
          console.error("SignalR Connection Error: ", err);
        });

      return () => {
        if (newConnection) {
          newConnection
            .stop()
            .catch((err: Error) =>
              console.error("SignalR Disconnection Error: ", err)
            );
        }
      };
    }
  }, [accessToken, userRole]);

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveNotification", (message) => {
        notifications.show({
          title: "Thông báo",
          message: message,
          color: "teal",
          autoClose: false,
          position: "top-right",
        });
      });

      return () => {
        connection.off("ReceiveNotification");
      };
    }
  }, [connection]);

  return (
    <SignalRContext.Provider value={connection}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  return useContext(SignalRContext);
};
