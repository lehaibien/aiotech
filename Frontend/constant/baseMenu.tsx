import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
    icon: <StoreOutlinedIcon />,
    path: "/products",
  },
  {
    name: "Tin tức",
    icon: <BookOutlinedIcon />,
    path: "/blogs",
  },
  {
    name: "Liên hệ",
    icon: <ContactsOutlinedIcon />,
    path: "/contact",
  },
  {
    name: "Giới thiệu",
    icon: <InfoOutlinedIcon />,
    path: "/about",
  },
];
