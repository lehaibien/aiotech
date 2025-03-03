import UserIcon from '@mui/icons-material/AccountCircleOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoneyOutlined';
import OrderIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Box, Grid2 as Grid, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import StatCard from './StatCard';

interface KPI {
  title: string;
  value: string;
  percentageChange: number;
  icon: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
    muiName: string;
};
}

const mockKPIs: KPI[] = [
  {
    title: 'Doanh thu',
    value: '$1200',
    percentageChange: 10,
    icon: AttachMoneyIcon,
  },
  {
    title: 'Lợi nhuận',
    value: '$1000',
    percentageChange: 10,
    icon: AttachMoneyIcon,
  },
  { title: 'Khách hàng', value: '100', percentageChange: -5, icon: UserIcon },
  { title: 'Đơn hàng', value: '200', percentageChange: 15, icon: OrderIcon },
];

export default function KPISection() {
  return (
    <Box>
      <Grid container spacing={2}>
      {mockKPIs.map((kpi, index) => (
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