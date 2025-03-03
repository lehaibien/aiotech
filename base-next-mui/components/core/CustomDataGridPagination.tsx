import { PAGE_SIZE_OPTIONS } from "@/constant/common";
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  FirstPageRounded,
  LastPageRounded,
  RefreshRounded,
} from "@mui/icons-material";
import {
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  gridPaginationModelSelector,
  gridRowCountSelector,
  useGridApiContext,
} from "@mui/x-data-grid";
import React from "react";

type DataGridPaginationProps = {
  isLoading: boolean;
  refreshGrid: () => void;
};

function DataGridPagination({
  isLoading,
  refreshGrid,
}: DataGridPaginationProps) {
  const apiRef = useGridApiContext();
  const { page, pageSize } = gridPaginationModelSelector(apiRef);
  const rowCount = gridRowCountSelector(apiRef);
  const totalPage = Math.ceil(rowCount / pageSize);

  // Handle page change via input
  const handlePageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = Number(event.target.value) - 1;
    if (!isNaN(newPage) && newPage >= 0 && newPage < totalPage) {
      apiRef.current.setPage(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    apiRef.current.setPageSize(Number(event.target.value));
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      padding={1}
      sx={{ width: "100%" }}
    >
      {/* Pagination Controls */}
      <Stack direction="row" alignItems="center" spacing={1}>
        {/* First Page Button */}
        <IconButton
          onClick={() => apiRef.current.setPage(0)}
          disabled={isLoading || page === 0}
          size="small"
          aria-label="First page"
        >
          <FirstPageRounded />
        </IconButton>

        {/* Previous Page Button */}
        <IconButton
          onClick={() => apiRef.current.setPage(page - 1)}
          disabled={isLoading || page === 0}
          size="small"
          aria-label="Previous page"
        >
          <ChevronLeftRounded />
        </IconButton>

        {/* Current Page Input */}
        <TextField
          type="number"
          value={page + 1}
          onChange={handlePageChange}
          inputProps={{ min: 1, max: totalPage }}
          variant="outlined"
          size="small"
          sx={{ width: 60 }}
        />

        {/* Total Pages Label */}
        <Typography
          variant="body2"
          color="text.secondary"
          display={{ xs: "none", md: "inline" }}
        >
          trong tổng số {totalPage}
        </Typography>

        {/* Next Page Button */}
        <IconButton
          onClick={() => apiRef.current.setPage(page + 1)}
          disabled={isLoading || page >= totalPage - 1}
          size="small"
          aria-label="Next page"
        >
          <ChevronRightRounded />
        </IconButton>

        {/* Last Page Button */}
        <IconButton
          onClick={() => apiRef.current.setPage(totalPage - 1)}
          disabled={isLoading || page >= totalPage - 1}
          size="small"
          aria-label="Last page"
        >
          <LastPageRounded />
        </IconButton>
      </Stack>

      {/* Page Size Selector */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        display={{ xs: "none", md: "flex" }}
      >
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          variant="outlined"
          size="small"
          sx={{ minWidth: 80 }}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body2" color="text.secondary">
          dòng mỗi trang
        </Typography>
      </Stack>

      {/* Row Count Summary */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="right"
          display={{ xs: "none", md: "inline" }}
        >
          {`${page * pageSize + 1} - ${Math.min(
            (page + 1) * pageSize,
            rowCount
          )} trong ${rowCount} dòng`}
        </Typography>

        {/* Refresh Button */}
        <IconButton onClick={refreshGrid} size="small" aria-label="Refresh">
          <RefreshRounded />
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default React.memo(DataGridPagination);
