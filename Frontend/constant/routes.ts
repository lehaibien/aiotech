import { DashboardNavItem, NavItem } from "@/types/ui";
import {
  BadgeCheck,
  ChartBar,
  ChartLine,
  ChartScatter,
  LayoutDashboard,
  LayoutGrid,
  MonitorCog,
  Package,
  ReceiptText,
  ScrollText,
  Settings,
  ShoppingBag,
  Star,
  StickyNote,
  UserCog,
} from "lucide-react";

export const baseNavItems: NavItem[] = [
  {
    title: "Cửa hàng",
    href: "/products",
  },
  {
    title: "Tin tức",
    href: "/blogs",
  },
  {
    title: "Liên hệ",
    href: "/contact",
  },
  {
    title: "Giới thiệu",
    href: "/about",
  },
];

export const dashboardNavItems: DashboardNavItem[] = [
  {
    title: "Trang tổng quan",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Sản phẩm",
    icon: ShoppingBag,
    items: [
      {
        title: "Danh sách",
        icon: Package,
        href: "/dashboard/products",
      },
      {
        title: "Danh mục",
        icon: LayoutGrid,
        href: "/dashboard/categories",
      },
      {
        title: "Thương hiệu",
        icon: BadgeCheck,
        href: "/dashboard/brands",
      },
    ],
  },
  {
    title: "Đơn hàng",
    icon: ReceiptText,
    items: [
      {
        title: "Quản lý",
        icon: ScrollText,
        href: "/dashboard/orders",
      },
      {
        title: "Đánh giá",
        icon: Star,
        href: "/dashboard/reviews",
      },
    ],
  },
  {
    title: "Bài viết",
    icon: StickyNote,
    items: [
      {
        title: "Danh sách",
        icon: StickyNote,
        href: "/dashboard/posts",
      },
    ],
  },
  {
    title: "Báo cáo",
    icon: ChartLine,
    items: [
      {
        title: "Báo cáo doanh thu",
        icon: ChartBar,
        href: "/dashboard/reports/sale",
      },
      {
        title: "Báo cáo khách hàng mua nhiều",
        icon: ChartScatter,
        href: "/dashboard/reports/top-customer",
      },
      {
        title: "Thống kê đánh giá sản phẩm",
        icon: Star,
        href: "/dashboard/reports/product-rating",
      },
      {
        title: "Thống kê trạng thái kho",
        icon: ShoppingBag,
        href: "/dashboard/reports/inventory-status",
      },
      {
        title: "Thống kê hiệu suất danh mục",
        icon: LayoutGrid,
        href: "/dashboard/reports/category-performance",
      },
      {
        title: "Thống kê hiệu suất thương hiệu",
        icon: BadgeCheck,
        href: "/dashboard/reports/brand-performance",
      },
    ],
  },
  {
    title: "Hệ thống",
    icon: MonitorCog,
    items: [
      {
        title: "Tài khoản",
        icon: UserCog,
        href: "/dashboard/users",
      },
      {
        title: "Cài đặt hệ thống",
        icon: Settings,
        href: "/dashboard/config",
      },
    ],
  },
];
