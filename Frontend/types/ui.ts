import { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href?: string;
};

export type DashboardNavItem = {
  title: string;
  icon: LucideIcon;
  href?: string;
  items?: DashboardNavItem[];
};
