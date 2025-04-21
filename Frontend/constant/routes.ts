import { DashboardNavItem, NavItem } from '@/types/ui';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import BrandingWatermarkOutlinedIcon from '@mui/icons-material/BrandingWatermarkOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import SensorDoorOutlinedIcon from '@mui/icons-material/SensorDoorOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const baseNavItems: NavItem[] = [
  {
    title: 'Cửa hàng',
    icon: StoreOutlinedIcon,
    href: '/products',
  },
  {
    title: 'Tin tức',
    icon: BookOutlinedIcon,
    href: '/blogs',
  },
  {
    title: 'Liên hệ',
    icon: ContactsOutlinedIcon,
    href: '/contact',
  },
  {
    title: 'Giới thiệu',
    icon: InfoOutlinedIcon,
    href: '/about',
  },
];

export const dashboardNavItems: DashboardNavItem[] = [
  {
    title: 'Trang tổng quan',
    icon: DashboardOutlinedIcon,
    href: '/dashboard',
  },
  {
    title: 'Sản phẩm',
    icon: ShoppingBagOutlinedIcon,
    items: [
      {
        title: 'Danh sách',
        icon: InventoryOutlinedIcon,
        href: '/dashboard/products',
      },
      {
        title: 'Danh mục',
        icon: CategoryOutlinedIcon,
        href: '/dashboard/categories',
      },
      {
        title: 'Thương hiệu',
        icon: BrandingWatermarkOutlinedIcon,
        href: '/dashboard/brands',
      },
    ],
  },
  {
    title: 'Đơn hàng',
    icon: ReceiptIcon,
    items: [
      {
        title: 'Quản lý',
        icon: LocalMallIcon,
        href: '/dashboard/orders',
      },
      {
        title: 'Đánh giá',
        icon: ReviewsOutlinedIcon,
        href: '/dashboard/reviews',
      },
    ],
  },
  {
    title: 'Bài viết',
    icon: DescriptionOutlinedIcon,
    items: [
      {
        title: 'Danh sách',
        icon: DescriptionOutlinedIcon,
        href: '/dashboard/posts',
      },
    ],
  },
  {
    title: 'Báo cáo',
    icon: BarChartOutlinedIcon,
    items: [
      {
        title: 'Báo cáo doanh thu',
        icon: BarChartOutlinedIcon,
        href: '/dashboard/reports/sale',
      },
      {
        title: 'Báo cáo khách hàng mua nhiều',
        icon: AccountCircleOutlinedIcon,
        href: '/dashboard/reports/top-customer',
      },
      {
        title: 'Thống kê đánh giá sản phẩm',
        icon: ShoppingBagOutlinedIcon,
        href: '/dashboard/reports/product-rating',
      },
      {
        title: 'Thống kê trạng thái kho',
        icon: InventoryOutlinedIcon,
        href: '/dashboard/reports/inventory-status',
      },
      {
        title: 'Thống kê hiệu suất danh mục',
        icon: CategoryOutlinedIcon,
        href: '/dashboard/reports/category-performance',
      },
      {
        title: 'Thống kê hiệu suất thương hiệu',
        icon: BrandingWatermarkOutlinedIcon,
        href: '/dashboard/reports/brand-performance',
      },
    ],
  },
  {
    title: 'Hệ thống',
    icon: SensorDoorOutlinedIcon,
    items: [
      {
        title: 'Tài khoản',
        icon: AccountCircleOutlinedIcon,
        href: '/dashboard/users',
      },
      {
        title: 'Cài đặt hệ thống',
        icon: SettingsOutlinedIcon,
        href: '/dashboard/config',
      },
    ],
  },
];
