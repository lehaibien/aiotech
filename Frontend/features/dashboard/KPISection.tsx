import { Box, Grid2 as Grid, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import StatCard from "./StatCard";

interface KPI {
  title: string;
  value: string;
  percentageChange: number;
  icon: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
    muiName: string;
  };
}

type KPISectionProps = {
  data: KPI[];
};

export default function KPISection({ data = [] }: KPISectionProps) {
  return (
    <Box>
      <Grid container spacing={2}>
        {data.map((kpi, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <StatCard
              title={kpi.title}
              value={kpi.value}
              percentageChange={kpi.percentageChange}
              icon={kpi.icon}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
