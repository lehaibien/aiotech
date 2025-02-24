import CustomDataGrid from '@/components/core/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'trackingNumber', headerName: 'Mã đơn hàng', width: 200, align: 'center' },
  { field: 'customerName', headerName: 'Customer', flex: 1, minWidth: 200 },
  { field: 'orderDate', headerName: 'Order Date', width: 150, align: 'center' },
  { field: 'total', headerName: 'Total', width: 120, type: 'number' },
  { field: 'status', headerName: 'Status', width: 120 },
];

const mockOrders = [
  {
    id: 1,
    trackingNumber: '123456',
    customerName: 'John Doe',
    orderDate: '2023-11-25',
    total: 299.99,
    status: 'Shipped',
  },
  {
    id: 2,
    trackingNumber: '654321',
    customerName: 'Jane Smith',
    orderDate: '2023-11-24',
    total: 199.5,
    status: 'Processing',
  },
  {
    id: 3,
    trackingNumber: '987654',
    customerName: 'Bob Johnson',
    orderDate: '2023-11-23',
    total: 499.99,
    status: 'Delivered',
  },
  {
    id: 4,
    trackingNumber: '456789',
    customerName: 'Alice Brown',
    orderDate: '2023-11-22',
    total: 149.99,
    status: 'Shipped',
  },
  {
    id: 5,
    trackingNumber: '321654',
    customerName: 'Charlie Wilson',
    orderDate: '2023-11-21',
    total: 399.99,
    status: 'Processing',
  },
];

export default function RecentOrders() {
  return (
    <CustomDataGrid
      columns={columns}
      withRowNumber
      loadData={async (page, pageSize) => {
        return {
          items: mockOrders,
          pageIndex: page,
          pageSize: pageSize,
          totalCount: mockOrders.length,
        };
      }}
    />
  );
}
