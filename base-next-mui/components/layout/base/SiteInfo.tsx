import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Grid2 as Grid, Typography } from "@mui/material";

export default function SiteInfo() {
  return (
    <Grid
      container
      spacing={1}
      display={{ md: "none", lg: "flex" }}
      alignItems="center"
      sx={{
        flexGrow: 1,
        px: 4,
        py: 0,
      }}
    >
      {[
        "Đổi trả 7 ngày",
        "Miễn phí vận chuyển",
        "Trả góp 0%",
        "Bảo hành chính hãng",
      ].map((service) => (
        <Grid
          key={service}
          size={{ xs: 6, md: 3 }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1,
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
          <Typography variant="body2">{service}</Typography>
        </Grid>
      ))}
    </Grid>
  );
}
