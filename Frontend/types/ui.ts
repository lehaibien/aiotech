import { SvgIconComponent } from '@mui/icons-material';

export type NavItem = {
  title: string;
  icon: SvgIconComponent;
  href?: string;
};

export type DashboardNavItem = {
  title: string;
  icon: SvgIconComponent;
  href?: string;
  items?: DashboardNavItem[];
};
