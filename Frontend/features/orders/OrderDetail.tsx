"use client";

import { NoItem } from "@/components/core/NoItem";
import dayjs from "@/lib/extended-dayjs";
import { formatNumberWithSeperator, mapOrderStatus } from "@/lib/utils";
import { OrderResponse } from "@/types/order";
import { Card, Grid, Group, Stack, Table, Text, Title } from "@mantine/core";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  Calendar,
  CreditCard,
  Ellipsis,
  FolderPen,
  Map,
  Package,
  Phone,
  Truck,
} from "lucide-react";

type OrderDetailProps = {
  order?: OrderResponse;
};

export const OrderDetail = ({ order }: OrderDetailProps) => {
  if (!order)
    return (
      <NoItem
        title="Đơn hàng không tồn tại"
        description=""
        icon={ReceiptIcon}
      />
    );
  return (
    <>
      <Grid>
        <Grid.Col
          span={{
            base: 12,
            md: 6,
          }}
        >
          <Card>
            <Title order={6}>Thông tin đơn hàng</Title>
            <Stack gap={32}>
              <Group>
                <Package />
                <div>
                  <Text size="sm">Mã đơn hàng:</Text>
                  <Text size="sm">{order.trackingNumber}</Text>
                </div>
              </Group>
              <Group>
                <Calendar />
                <div>
                  <Text size="sm">Ngày đặt hàng:</Text>
                  <Text size="sm">
                    {dayjs(order.createdDate).format("DD/MM/YYYY")}
                  </Text>
                </div>
              </Group>
              <Group>
                <Truck />
                <div>
                  <Text size="sm">Ngày giao hàng:</Text>
                  <Text size="sm">
                    {order.deliveryDate
                      ? dayjs(order.deliveryDate).format("DD/MM/YYYY")
                      : "Chưa cập nhật"}
                  </Text>
                </div>
              </Group>
              <Group>
                <Ellipsis />
                <div>
                  <Text size="sm">Trạng thái:</Text>
                  <Text size="sm">{mapOrderStatus(order.status)}</Text>
                </div>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            md: 6,
          }}
        >
          <Card>
            <Title order={6}>Thông tin khách hàng</Title>
            <Stack gap={32}>
              <Group>
                <FolderPen />
                <div>
                  <Text size="sm">Họ và tên:</Text>
                  <Text size="sm">{order.name}</Text>
                </div>
              </Group>
              <Group>
                <Phone />
                <div>
                  <Text size="sm">Số điện thoại:</Text>
                  <Text size="sm">{order.phoneNumber}</Text>
                </div>
              </Group>
              <Group>
                <Map />
                <div>
                  <Text size="sm">Địa chỉ:</Text>
                  <Text size="sm">{order.address}</Text>
                </div>
              </Group>
              <Group>
                <CreditCard />
                <div>
                  <Text size="sm">Phương thức thanh toán:</Text>
                  <Text size="sm">
                    {order.paymentProvider ?? "Chưa thanh toán"}
                  </Text>
                </div>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
      <Card>
        <Title order={6}>Chi tiết đơn hàng</Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Sản phẩm</Table.Th>
              <Table.Th ta="right">Giá</Table.Th>
              <Table.Th ta="center">Số lượng</Table.Th>
              <Table.Th ta="right">Thành tiền</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {order.orderItems.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.productName}</Table.Td>
                <Table.Td align="right">
                  {formatNumberWithSeperator(item.price)} đ
                </Table.Td>
                <Table.Td align="center">{item.quantity}</Table.Td>
                <Table.Td align="right">
                  {formatNumberWithSeperator(item.totalPrice)} đ
                </Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr>
              <Table.Td colSpan={3} align="right">
                <Text size="sm">Thuế GTGT:</Text>
              </Table.Td>
              <Table.Td align="right">
                {order.tax.toLocaleString("vi-VN")} đ
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td colSpan={3} align="right">
                <Text size="sm">Thành tiền:</Text>
              </Table.Td>
              <Table.Td align="right">
                {order.totalPrice.toLocaleString("vi-VN")} đ
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>
      {/* <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin đơn hàng
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PackageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Mã đơn hàng"
                    secondary={order.trackingNumber}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ngày đặt hàng"
                    secondary={dayjs(order.createdDate).format("DD/MM/YYYY")}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TruckIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ngày giao hàng"
                    secondary={
                      order.deliveryDate
                        ? dayjs(order.deliveryDate).format("DD/MM/YYYY")
                        : "Chưa cập nhật"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PendingIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Trạng thái:"
                    secondary={mapOrderStatus(order.status)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin khách hàng
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tên" secondary={order.name} />
                </ListItem>
                {order.phoneNumber && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Số điện thoại"
                      secondary={order.phoneNumber}
                    />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemIcon>
                    <MapPinIcon />
                  </ListItemIcon>
                  <ListItemText primary="Địa chỉ" secondary={order.address} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CreditCardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phương thức thanh toán"
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
          <Typography variant="h6" gutterBottom>
            Chi tiết đơn hàng
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell align="right">Giá</TableCell>
                <TableCell align="right">Số lượng</TableCell>
                <TableCell align="right">Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell align="right">
                    {formatNumberWithSeperator(item.price)} đ
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {formatNumberWithSeperator(item.totalPrice)} đ
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="right"
                  sx={{ fontWeight: "bold" }}
                >
                  Thuế GTGT
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {formatNumberWithSeperator(order.tax)} đ
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="right"
                  sx={{ fontWeight: "bold" }}
                >
                  Thành tiền
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {formatNumberWithSeperator(order.totalPrice)} đ
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {order.note && (
        <Card sx={{ marginTop: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ghi chú
            </Typography>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <FileTextIcon />
              <Typography>{order.note}</Typography>
            </Box>
          </CardContent>
        </Card>
      )} */}
    </>
  );
};
