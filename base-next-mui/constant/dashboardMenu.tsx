import {
  AccountCircleOutlined,
  BarChartOutlined,
  BrandingWatermarkOutlined,
  CategoryOutlined,
  DashboardOutlined,
  InventoryOutlined,
  ReviewsOutlined,
  SensorDoorOutlined,
  SettingsOutlined,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

export interface DashboardMenu {
  name: string;
  icon: JSX.Element;
  path?: string;
  children?: DashboardMenu[];
}

export const dashboardMenus: DashboardMenu[] = [
  {
    name: "Trang tổng quan",
    icon: <DashboardOutlined />,
    path: "/dashboard",
  },
  {
    name: "Sản phẩm",
    icon: <ShoppingBagOutlined />,
    children: [
      {
        name: "Danh sách",
        icon: <InventoryOutlined />,
        path: "/dashboard/products",
      },
      {
        name: "Danh mục",
        icon: <CategoryOutlined />,
        path: "/dashboard/categories",
      },
      {
        name: "Thương hiệu",
        icon: <BrandingWatermarkOutlined />,
        path: "/dashboard/brands",
      },
    ],
  },
  {
    name: "Đơn hàng",
    icon: <ReceiptIcon />,
    children: [
      {
        name: "Quản lý",
        icon: <LocalMallIcon />,
        path: "/dashboard/orders",
      },
      {
        name: "Đánh giá",
        icon: <ReviewsOutlined />,
        path: "/dashboard/reviews",
      },
    ],
  },
  {
    name: "Bài viết",
    icon: <DescriptionOutlinedIcon />,
    children: [
      {
        name: "Danh sách",
        icon: <DescriptionOutlinedIcon />,
        path: "/dashboard/posts",
      },
    ],
  },
  {
    name: "Báo cáo",
    icon: <BarChartOutlined />,
    children: [
      {
        name: "Báo cáo doanh số",
        icon: <BarChartOutlined />,
        path: "/dashboard/reports/sale",
      },
      {
        name: "Báo cáo đơn hàng",
        icon: <ReceiptIcon />,
        path: "/dashboard/reports/order",
      },
      {
        name: "Báo cáo sản phẩm",
        icon: <ShoppingBagOutlined />,
        path: "/dashboard/reports/product-rating",
      },
    ],
  },
  {
    name: "Hệ thống",
    icon: <SensorDoorOutlined />,
    children: [
      // { name: 'Vai trò', icon: <SecurityOutlined />, path: '/dashboard/roles' },
      {
        name: "Tài khoản",
        icon: <AccountCircleOutlined />,
        path: "/dashboard/accounts",
      },
      {
        name: "Cài đặt hệ thống",
        icon: <SettingsOutlined />,
        path: "/dashboard/config",
      },
    ],
  },
];
