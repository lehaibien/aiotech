"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { SecurityForm } from "./SecurityForm";
import { ProfileForm } from "./ProfileForm";
import OrderHistory from "./OrderHistory";

const TabPanel = ({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const tabs = [
  { label: "Thông tin", component: <ProfileForm /> },
  {
    label: "Bảo mật",
    component: <SecurityForm />,
  },
  { label: "Lịch sử mua hàng", component: <OrderHistory /> },
];

type ProfileTabProps = {
  defaultTab: number;
};

export default function ProfileTab({ defaultTab = 0 }: ProfileTabProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", newValue.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={defaultTab} onChange={handleTabChange}>
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={defaultTab} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </>
  );
}
