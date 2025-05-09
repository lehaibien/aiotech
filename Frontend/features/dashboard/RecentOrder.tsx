"use client";

import { formatDate, formatNumberWithSeperator } from "@/lib/utils";
import { OrderResponse } from "@/types";
import { Center, Table, Text } from "@mantine/core";

type RecentOrdersProps = {
  data: OrderResponse[];
};

export const RecentOrders = ({ data }: RecentOrdersProps) => {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Mã đơn hàng</Table.Th>
          <Table.Th>Khách hàng</Table.Th>
          <Table.Th>Số điện thoại</Table.Th>
          <Table.Th ta="center">Ngày đặt hàng</Table.Th>
          <Table.Th ta="right">Thành tiền</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {data.map((row) => (
          <Table.Tr key={row.trackingNumber}>
            <Table.Td>{row.trackingNumber}</Table.Td>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.phoneNumber}</Table.Td>
            <Table.Td ta="center">{formatDate(row.createdDate)}</Table.Td>
            <Table.Td ta="right">
              {formatNumberWithSeperator(row.totalPrice)} đ
            </Table.Td>
          </Table.Tr>
        ))}

        {data.length === 0 && (
          <Table.Tr>
            <Table.Td colSpan={5} style={{ height: "400px" }}>
              <Center>
                <Text c="dimmed">Không có dữ liệu</Text>
              </Center>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
};
