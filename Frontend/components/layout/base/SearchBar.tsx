"use client";

import { API_URL } from "@/constant/apiUrl";
import { ProductSearchList } from "@/features/search/ProductSearchList";
import { getApiQuery } from "@/lib/apiClient";
import { ComboBoxItem, ProductResponse } from "@/types";
import { Button, Group, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type SearchBarProps = {
  categories: ComboBoxItem[];
};

async function getSearchResults(
  query: string,
  category: string | undefined
): Promise<ProductResponse[]> {
  if (!query.trim()) {
    return [];
  }
  try {
    const res = await getApiQuery(API_URL.productSearch, {
      textSearch: query,
      category: category,
      searchLimit: 8,
    });
    if (res.success) {
      return res.data as ProductResponse[];
    }
  } catch (err) {
    console.error(err);
  }

  return [];
}

export const SearchBar = ({ categories }: SearchBarProps) => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [category, setCategory] = useState("all");
  const tranformedCategories = [
    {
      text: "Tất cả danh mục",
      value: "all",
    },
    ...categories,
  ].map((x) => {
    return {
      label: x.text,
      value: x.value,
    };
  });

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

  const handleDebounceQuery = useDebouncedCallback(async (query: string) => {
    setLoading(true);
    const result = await getSearchResults(
      query,
      category === "all" ? undefined : category
    );
    setProducts(result);
    setLoading(false);
  }, 500);

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    handleDebounceQuery(value);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("q", searchQuery);
    if (category === "all") {
      params.delete("category");
    }
    params.set("category", category);
    router.push(`/products?${params.toString()}`);
    close();
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (searchQuery.trim()) {
      handleDebounceQuery(searchQuery);
    }
  };

  const handleSearchClick = () => {
    setSearchQuery("");
    if (opened) {
      close();
    }
  };

  const renderSearchInput = () => {
    return (
      <>
        <Group gap={0} w="100%">
          <TextInput
            value={searchQuery}
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setTimeout(() => setIsFocus(false), 200)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSearch : undefined)}
            placeholder="Tìm kiếm sản phẩm..."
            leftSection={<Search />}
            flex={5}
            styles={{
              input: {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: 0,
              },
            }}
          />
          <Select
            data={tranformedCategories}
            value={category}
            onChange={(_, option) => handleCategoryChange(option.value)}
            withScrollArea
            allowDeselect={false}
            flex={2}
            styles={{
              input: {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              },
            }}
          />
        </Group>
      </>
    );
  };

  return (
    <>
      <Button
        variant="transparent"
        c="dark"
        onClick={open}
        aria-label="search"
        display={{
          base: "block",
          md: "none",
        }}
        mah={40}
        px={0}
      >
        <Search />
      </Button>

      <Stack
        display={{
          base: "none",
          md: "flex",
        }}
        pos="relative"
        w="100%"
      >
        {renderSearchInput()}
        {isFocus && products.length > 0 && (
          <ProductSearchList products={productSearchList} />
        )}
      </Stack>

      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        withCloseButton
        fullScreen
        title="Tìm kiếm sản phẩm"
      >
        <Stack>
          {renderSearchInput()}
          {products.length > 0 && (
            <ProductSearchList
              products={productSearchList}
              isDrawer={true}
              onClick={handleSearchClick}
            />
          )}
        </Stack>
      </Modal>
    </>
  );
};
