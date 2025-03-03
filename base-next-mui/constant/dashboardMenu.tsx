import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ReviewsOutlinedIcon from "@mui/icons-material/ReviewsOutlined";
import SensorDoorOutlinedIcon from "@mui/icons-material/SensorDoorOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import LocalMallIcon from "@mui/icons-material/LocalMall";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

export interface DashboardMenu {
  name: string;
  icon: JSX.Element;
  path?: string;
  children?: DashboardMenu[];
}

export const dashboardMenus: DashboardMenu[] = [
  {
    name: "Trang tổng quan",
    icon: <DashboardOutlinedIcon />,
    path: "/dashboard",
  },
  {
    name: "Sản phẩm",
    icon: <ShoppingBagOutlinedIcon />,
    children: [
      {
        name: "Danh sách",
        icon: <InventoryOutlinedIcon />,
        path: "/dashboard/products",
      },
      {
        name: "Danh mục",
        icon: <CategoryOutlinedIcon />,
        path: "/dashboard/categories",
      },
      {
        name: "Thương hiệu",
        icon: <BrandingWatermarkOutlinedIcon />,
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
        icon: <ReviewsOutlinedIcon />,
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
    icon: <BarChartOutlinedIcon />,
    children: [
      {
        name: "Báo cáo doanh số",
        icon: <BarChartOutlinedIcon />,
        path: "/dashboard/reports/sale",
      },
      {
        name: "Báo cáo đơn hàng",
        icon: <ReceiptIcon />,
        path: "/dashboard/reports/order",
      },
      {
        name: "Thống kê đánh giá sản phẩm",
        icon: <ShoppingBagOutlinedIcon />,
        path: "/dashboard/reports/product-rating",
      },
      {
        name: "Thống kê sản phẩm gần hết hàng",
        icon: <InventoryOutlinedIcon />,
        path: "/dashboard/reports/out-of-stock",
      },
      {
        name: "Thống kê hiệu suất danh mục",
        icon: <CategoryOutlinedIcon />,
        path: "/dashboard/reports/category-performance",
      },
      {
        name: "Thống kê hiệu suất thương hiệu",
        icon: <BrandingWatermarkOutlinedIcon />,
        path: "/dashboard/reports/brand-performance",
      },
      {
        name: "Thống kê khách hàng mua nhiều",
        icon: <AccountCircleOutlinedIcon />,
        path: "/dashboard/reports/top-customer",
      },
    ],
  },
  {
    name: "Hệ thống",
    icon: <SensorDoorOutlinedIcon />,
    children: [
      // { name: 'Vai trò', icon: <SecurityOutlined />, path: '/dashboard/roles' },
      {
        name: "Tài khoản",
        icon: <AccountCircleOutlinedIcon />,
        path: "/dashboard/accounts",
      },
      {
        name: "Cài đặt hệ thống",
        icon: <SettingsOutlinedIcon />,
        path: "/dashboard/config",
      },
    ],
  },
];
