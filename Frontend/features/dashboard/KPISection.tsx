'use client'

import { Grid } from "@mantine/core";
import { LucideIcon } from "lucide-react";
import { StatCard } from "./StatCard";

type KPI = {
  title: string;
  value: string;
  percentageChange: number;
  icon: LucideIcon;
};

type KPISectionProps = {
  data: KPI[];
};

export const KPISection = ({ data = [] }: KPISectionProps) => {
  return (
    <Grid>
      {data.map((kpi, index) => (
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={index}>
          <StatCard
            title={kpi.title}
            value={kpi.value}
            diff={kpi.percentageChange}
            icon={kpi.icon}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};
