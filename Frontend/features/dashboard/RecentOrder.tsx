"use client";

import NoRowOverlay from "@/components/core/NoRowOverlay";
import { formatDate, formatNumberWithSeperator } from "@/lib/utils";
import { OrderResponse } from "@/types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { GridColDef } from "@mui/x-data-grid";

const columns: GridColDef<OrderResponse>[] = [
  {
    field: "trackingNumber",
    headerName: "Mã đơn hàng",
    width: 250,
  },
  { field: "name", headerName: "Khách hàng", flex: 1, minWidth: 200 },
  {
    field: "phoneNumber",
    headerName: "Số điện thoại",
    width: 180,
  },
  {
    field: "createdDate",
    headerName: "Ngày đặt hàng",
    width: 180,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => formatDate(params),
  },
  { field: "totalPrice", headerName: "Thành tiền", width: 160, type: "number",
    align: "right",
   },
];

type RecentOrdersProps = {
  data: OrderResponse[];
};

export function RecentOrders({ data }: RecentOrdersProps) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        position: "relative",
        minHeight: 400,
        "& .MuiTableCell-root": {
          px: { xs: 1, sm: 2 },
          py: 1.5,
        },
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: grey[50] }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                sx={{
                  width: column.width,
                  minWidth: column.minWidth,
                  fontWeight: 600,
                  color: "text.secondary",
                }}
                align={column.align}
              >
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.trackingNumber}
              hover
              sx={{ "&:last-child td": { borderBottom: 0 } }}
            >
              <TableCell>{row.trackingNumber}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.phoneNumber}</TableCell>
              <TableCell align="center">
                {formatDate(row.createdDate)}
              </TableCell>
              <TableCell align="right">{formatNumberWithSeperator(row.totalPrice)} đ</TableCell>
            </TableRow>
          ))}

          {data.length === 0 && (
            <TableRow sx={{ height: 400 }}>
              <TableCell colSpan={columns.length}>
                <NoRowOverlay />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
