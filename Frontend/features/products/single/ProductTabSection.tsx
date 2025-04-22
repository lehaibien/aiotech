"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { UUID } from "@/types";
import React from "react";
import ReviewSection from "./ReviewSection";

type ProductTabSectionProps = {
  id: UUID;
  description: string;
};

function tabProps(index: number) {
  return {
    id: `product-tab-${index}`,
    "aria-controls": `product-tabpanel-${index}`,
  };
}

function ProductTabSection({ id, description }: ProductTabSectionProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Chi tiết sản phẩm" {...tabProps(1)} />
        <Tab label="Đánh giá" {...tabProps(2)} />
      </Tabs>
      <Box
        role="tabpanel"
        p={2}
        hidden={value !== 0}
        id={`product-tabpanel-1`}
        aria-labelledby={`product-tab-1`}
      >
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </Box>
      <Box
        role="tabpanel"
        hidden={value !== 1}
        id={`product-tabpanel-2`}
        aria-labelledby={`product-tab-2`}
      >
        <ReviewSection productId={id} />
      </Box>
    </>
  );
}

export default ProductTabSection;
