import { createContext, useState } from "react";

export const DashboardMenuContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([
  false,
  () => {},
]);

export default function DashboardMenuProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(true);
  return (
    <DashboardMenuContext.Provider value={[open, setOpen]}>
      {children}
    </DashboardMenuContext.Provider>
  );
}