"use client";

import { API_URL } from "@/constant/apiUrl";
import ProductSearchList from "@/features/search/ProductSearchList";
import { getApiQuery } from "@/lib/apiClient";
import { ComboBoxItem, ProductResponse } from "@/types";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
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
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type SearchBarProps = {
  categories: ComboBoxItem[];
};

export function SearchBar({ categories }: SearchBarProps) {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [category, setCategory] = useState("All Categories");

  const productSearchList = useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        name: product.name,
        image: product.imageUrls[0],
        price: product.price,
        brand: product.brand,
      })),
    [products]
  );

  const fetchSearch = useCallback(
    async (query: string, category: string | undefined) => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const res = await getApiQuery(API_URL.productSearch, {
          textSearch: query,
          category: category,
          searchLimit: 8,
        });
        if (res.success) setProducts(res.data as ProductResponse[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const debouncedSearch = useMemo(
    () => debounce(fetchSearch, 500),
    [fetchSearch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, [debouncedSearch]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("q", searchQuery);
    if (category !== "All Categories") params.set("category", category);
    router.push(`/products?${params.toString()}`);
    setOpen(false);
  };

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    const cat = category === "All Categories" ? undefined : category;
    debouncedSearch(value, cat);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    const cat = newCategory === "All Categories" ? undefined : newCategory;
    if (searchQuery.trim()) {
      fetchSearch(searchQuery, cat);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setCategory("All Categories");
    setProducts([]);
  };

  const handleSearchClick = () => {
    setSearchQuery("");
    if (open) {
      setOpen(false);
    }
  };

  const searchInput = (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            "& .MuiInputBase-input": {
              py: 1,
              transition: theme.transitions.create("width"),
            },
          }}
          placeholder="Tìm kiếm sản phẩm..."
          fullWidth
          value={searchQuery}
          onChange={(e) => handleSearchQueryChange(e.target.value)}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setTimeout(() => setIsFocus(false), 200)}
          startAdornment={
            <SearchIcon
              sx={{
                color: "action.active",
                mr: 1,
                transition: "color 0.2s",
                ...(isFocus && { color: "primary.main" }),
              }}
            />
          }
          endAdornment={
            searchQuery && (
              <IconButton size="small" onClick={handleClear} sx={{ mr: 0.5 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )
          }
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <Select
          value={category}
          onChange={handleCategoryChange}
          displayEmpty
          sx={(theme) => ({
            display: { xs: "none", md: "inline-flex" },
            width: { sm: 100, md: 200 },
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
      {isFocus && <ProductSearchList products={productSearchList} />}
    </Box>
  );

  return (
    <Box sx={{}}>
      <IconButton
        onClick={() => setOpen(true)}
        color="inherit"
        aria-label="search"
        sx={{
          display: { xs: "block", md: "none" },
          backgroundColor: theme.palette.grey[100],
          "&:hover": {
            backgroundColor: theme.palette.grey[200],
          },
        }}
      >
        <SearchIcon />
      </IconButton>

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          borderRadius: 2,
          border: `1px solid ${
            isFocus ? theme.palette.primary.main : theme.palette.divider
          }`,
          p: "2px 4px",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        {searchInput}
      </Box>

      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
        TransitionProps={{ timeout: 300 }}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "100%",
            height: { xs: "100%", lg: "auto" },
            m: 0,
            borderRadius: { xs: 0, md: 2 },
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
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6">Tìm kiếm sản phẩm</Typography>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              color: theme.palette.grey[500],
              transition: "color 0.2s",
              "&:hover": {
                color: theme.palette.grey[800],
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: theme.palette.grey[100],
                borderRadius: 1,
                p: "2px 4px",
                transition: "all 0.2s ease-in-out",
                "&:focus-within": {
                  bgcolor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ position: "relative", width: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <InputBase
                    sx={{
                      ml: 1,
                      flex: 1,
                      "& .MuiInputBase-input": {
                        py: 1,
                        transition: theme.transitions.create("width"),
                      },
                    }}
                    placeholder="Tìm kiếm sản phẩm..."
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => handleSearchQueryChange(e.target.value)}
                    onFocus={() => setIsFocus(true)}
                    startAdornment={
                      <SearchIcon
                        sx={{
                          color: "action.active",
                          mr: 1,
                          transition: "color 0.2s",
                          ...(isFocus && { color: "primary.main" }),
                        }}
                      />
                    }
                    endAdornment={
                      searchQuery && (
                        <IconButton
                          size="small"
                          onClick={handleClear}
                          sx={{ mr: 0.5 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />
                  <Select
                    value={category}
                    onChange={handleCategoryChange}
                    displayEmpty
                    sx={(theme) => ({
                      width: { xs: 120, sm: 160 },
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
                {isFocus && products.length > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1,
                      mt: 1,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <ProductSearchList
                      products={productSearchList}
                      isDrawer={true}
                      onClick={handleSearchClick}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
