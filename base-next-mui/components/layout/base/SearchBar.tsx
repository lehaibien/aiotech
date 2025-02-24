"use client";

import ProductSearchList from "@/components/base/search/ProductSearchList";
import { API_URL } from "@/constant/apiUrl";
import { getApiQuery } from "@/lib/apiClient";
import { ComboBoxItem, ProductResponse } from "@/types";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  debounce,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

type SearchBarProps = {
  categories: ComboBoxItem[];
};

export default function SearchBar({ categories }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const productSearchList = products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      image: product.imageUrls[0],
      price: product.price,
      brand: product.brand,
    };
  });
  const [isFocus, setIsFocus] = useState(false);
  const [category, setCategory] = useState("All Categories");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery, "in category:", category);
  };

  const fetchSearch = (query: string, category: string | undefined) => {
    getApiQuery(API_URL.productSearch, {
      textSearch: query,
      category: category,
      searchLimit: 8,
    })
      .then((res) => {
        if (res.success) setProducts(res.data as ProductResponse[]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSearchQueryChange = useCallback(
    (query: string, category: string) => {
      const trimmedQuery = query.trim();
      if (trimmedQuery === "") return;
      const cat = category === "All Categories" ? undefined : category;
      fetchSearch(trimmedQuery, cat);
    },
    []
  );

  const debouncedSearch = useMemo(
    () => debounce(handleSearchQueryChange, 500),
    [handleSearchQueryChange]
  );

  const handleFocus = () => {
    setIsFocus(true);
    // refetch
    const cat = category === "All Categories" ? undefined : category;
    fetchSearch(searchQuery, cat);
  };

  const handleBlur = () => {
    setIsFocus(false);
    // clear
    setProducts([]);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
    const cat =
      event.target.value === "All Categories" ? undefined : event.target.value;
    fetchSearch(searchQuery, cat);
  };

  const handleCategoryBlur = () => {
    setProducts([]);
  };

  const handleClear = () => {
    setSearchQuery("");
    setCategory("All Categories");
    setProducts([]);
  };

  const searchInput = (
    <Box
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Tìm kiếm sản phẩm..."
          inputProps={{ "aria-label": "search" }}
          value={searchQuery}
          color="primary"
          onChange={(event) => {
            setSearchQuery((prev) =>
              prev === event.target.value ? prev : event.target.value
            );
            debouncedSearch(event.target.value, category);
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          startAdornment={
            <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          }
          endAdornment={
            searchQuery !== "" && (
              <IconButton
                size="large"
                aria-label="search"
                color="inherit"
                onClick={() => handleClear()}
              >
                <CloseIcon />
              </IconButton>
            )
          }
        />
        <Select
          value={category}
          onChange={handleCategoryChange}
          onBlur={handleCategoryBlur}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          MenuProps={{
            sx: {
              maxHeight: "32rem",
            },
          }}
          sx={(theme) => ({
            display: {
              xs: "none",
              md: "inline-flex",
            },
            width: { sm: 100, md: 200 },
            textAlign: "center",
            "& .MuiSelect-select": {
              py: 1,
              pr: 4,
              pl: 1,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
              borderRadius: 0,
              borderLeft: `1px solid ${theme.palette.divider}`,
            },
          })}
          IconComponent={KeyboardArrowDownIcon}
        >
          <MenuItem value="All Categories">Tất cả danh mục</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.value} value={category.text}>
              {category.text}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <ProductSearchList products={productSearchList} />
    </Box>
  );

  return (
    <Box sx={{ width: "50%" }}>
      <IconButton
        onClick={handleClickOpen}
        color="inherit"
        aria-label="search"
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
        }}
      >
        <SearchIcon />
      </IconButton>
      <Box
        sx={(theme) => ({
          display: {
            xs: "none",
            md: "flex",
          },
          alignItems: "center",
          borderRadius: 2,
          border: isFocus
            ? `1px solid ${theme.palette.primary.main}`
            : `1px solid ${theme.palette.divider}`,
          p: "2px 4px",
          order: 1,
        })}
      >
        {searchInput}
      </Box>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "100%",
            height: {
              xs: "100%",
              lg: "auto",
            },
            m: 0,
            borderRadius: {
              xs: 0,
              md: 2,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>Tìm kiếm sản phẩm</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                p: "2px 4px",
              }}
            >
              {searchInput}
            </Box>
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={(theme) => ({
                bgcolor: theme.palette.primary.main,
                "&:hover": { bgcolor: theme.palette.primary.dark },
                alignSelf: "stretch",
              })}
            >
              Tìm kiếm
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
