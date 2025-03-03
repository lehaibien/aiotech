import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Box, Typography } from "@mui/material";

export function SiteInfo() {
  return (
    <Box
      display={{ xs: "none", md: "flex" }}
      gap={2}
      justifyContent="flex-end"
      alignItems="center"
      flexGrow={1}
      maxWidth="65%"
    >
      {[
        "Đổi trả 7 ngày",
        "Miễn phí vận chuyển",
        "Trả góp 0%",
        "Bảo hành chính hãng",
      ].map((service) => (
        <Box
          key={service}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {service === "Đổi trả 7 ngày" && (
            <CalendarTodayIcon fontSize="small" />
          )}
          {service === "Miễn phí vận chuyển" && (
            <LocalShippingIcon fontSize="small" />
          )}
          {service === "Trả góp 0%" && <PaymentIcon fontSize="small" />}
          {service === "Bảo hành chính hãng" && (
            <VerifiedIcon fontSize="small" />
          )}
          <Typography
            variant="body2"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            {service}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
