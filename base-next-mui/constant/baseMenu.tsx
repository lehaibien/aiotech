import {
  StoreOutlined
} from "@mui/icons-material";

export interface BaseNavigation {
  name: string;
  icon: JSX.Element;
  path?: string;
}

export const BaseNavigation: BaseNavigation[] = [
  // {
  //   name: 'Trang chủ',
  //   icon: <HomeOutlined />,
  //   path: '/',
  // },
  // {
  //   name: 'Dashboard',
  //   icon: <DashboardOutlined />,
  //   path: '/dashboard',
  // },
  {
    name: "Cửa hàng",
    icon: <StoreOutlined />,
    path: "/products",
  },
];
