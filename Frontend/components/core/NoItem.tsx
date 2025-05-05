"use client";

import { SvgIconComponent } from "@mui/icons-material";
import { Box, Container, Typography } from "@mui/material";
import { LucideIcon } from "lucide-react";

type NoItemProps = {
  title?: string;
  description: string;
  icon?: SvgIconComponent | LucideIcon;
};

export const NoItem = ({
  title = "Không có dữ liệu",
  description,
  icon: Icon,
}: NoItemProps) => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {Icon && <Icon />}
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          {description}
        </Typography>
      </Box>
    </Container>
  );
};
