'use client';

import { NoItem } from '@/components/core/NoItem';
import { formatNumberWithSeperator, mapOrderStatus } from '@/lib/utils';
import { OrderResponse } from '@/types/order';
import {
  CalendarToday as CalendarIcon,
  CreditCard as CreditCardIcon,
  Note as FileTextIcon,
  LocationOn as MapPinIcon,
  Inventory as PackageIcon,
  Pending as PendingIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocalShipping as TruckIcon,
} from '@mui/icons-material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from '@/lib/extended-dayjs';

type OrderDetailProps = {
  order?: OrderResponse;
};

export default function OrderDetail({ order }: OrderDetailProps) {
  if (!order)
    return (
      <NoItem
        title='Đơn hàng không tồn tại'
        description=''
        icon={ReceiptIcon}
      />
    );
  return (
    <Box sx={{}}>
      <Grid
        container
        spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography
                variant='h6'
                gutterBottom>
                Thông tin đơn hàng
              </Typography>
              <List
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}>
                <ListItem>
                  <ListItemIcon>
                    <PackageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Mã đơn hàng'
                    secondary={order.trackingNumber}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Ngày đặt hàng'
                    secondary={dayjs(order.createdDate).format('DD/MM/YYYY')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TruckIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Ngày giao hàng'
                    secondary={
                      order.deliveryDate
                        ? dayjs(order.deliveryDate).format('DD/MM/YYYY')
                        : 'Chưa cập nhật'
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PendingIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Trạng thái:'
                    secondary={mapOrderStatus(order.status)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography
                variant='h6'
                gutterBottom>
                Thông tin khách hàng
              </Typography>
              <List
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Tên'
                    secondary={order.name}
                  />
                </ListItem>
                {order.phoneNumber && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='Số điện thoại'
                      secondary={order.phoneNumber}
                    />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemIcon>
                    <MapPinIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Địa chỉ'
                    secondary={order.address}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CreditCardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary='Phương thức thanh toán'
                    secondary={order.paymentProvider}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card sx={{ marginTop: 3 }}>
        <CardContent>
          <Typography
            variant='h6'
            gutterBottom>
            Chi tiết đơn hàng
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell align='right'>Giá</TableCell>
                <TableCell align='right'>Số lượng</TableCell>
                <TableCell align='right'>Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell align='right'>
                    {formatNumberWithSeperator(item.price)} đ
                  </TableCell>
                  <TableCell align='right'>{item.quantity}</TableCell>
                  <TableCell align='right'>
                    {formatNumberWithSeperator(item.totalPrice)} đ
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  colSpan={3}
                  align='right'>
                  Thuế GTGT
                </TableCell>
                <TableCell align='right'>
                  {formatNumberWithSeperator(order.tax)} đ
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={3}
                  align='right'>
                  <Typography variant='h6'>Thành tiền</Typography>
                </TableCell>
                <TableCell align='right'>
                  <Typography variant='h6'>
                    {formatNumberWithSeperator(order.totalPrice)} đ
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {order.note && (
        <Card sx={{ marginTop: 3 }}>
          <CardContent>
            <Typography
              variant='h6'
              gutterBottom>
              Ghi chú
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <FileTextIcon />
              <Typography>{order.note}</Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
