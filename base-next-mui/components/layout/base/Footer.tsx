import BrandLogo from "@/components/core/BrandLogo";
import { HighlightTypography } from "@/components/core/HighlightTypography";
import { Email, Facebook, Instagram, LocationOn, Phone, X, YouTube } from "@mui/icons-material";
import {
  Box,
  Grid2 as Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import dayjs from '@/lib/extended-dayjs';
import "server-only";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        pb: 0,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Grid container spacing={4}>
        {/* Về chúng tôi */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <BrandLogo />
            <Typography variant="h5" color="text.primary">
              AioTech
            </Typography>
          </Stack>
          <Typography variant="body1" gutterBottom>
            Hệ thống bán lẻ điện tử công nghệ hàng đầu Việt Nam
          </Typography>

          <Typography variant="body1" gutterBottom sx={{ fontWeight: 600 }}>
            Hỗ trợ thanh toán
          </Typography>
          <Stack spacing={2} direction="row">
            {["VnPay", "Momo"].map((text) => (
              <Box key={text} display="flex" alignItems="center" gap={1}>
                <Image
                  src={`/${text.toLowerCase()}-icon.svg`}
                  alt={text}
                  width={24}
                  height={24}
                />
                <Typography variant="body2">{text}</Typography>
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* Hỗ trợ khách hàng */}
        <Grid size={{ xs: 6, md: 3 }}>
          <Stack spacing={1}>
            <HighlightTypography variant="h6">Hỗ trợ</HighlightTypography>
            {[
              "Trung tâm hỗ trợ",
              "Hướng dẫn mua hàng",
              "Tra cứu đơn hàng",
              "Chính sách bảo hành",
            ].map((text) => (
              <Link
                key={text}
                href="#"
                sx={{
                  display: "block",
                  py: 0.5,
                  color: "inherit",
                  transition: "color 0.2s",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {text}
              </Link>
            ))}
          </Stack>
        </Grid>

        {/* Chính sách */}
        <Grid size={{ xs: 6, md: 3 }}>
          <Stack spacing={1}>
            <HighlightTypography variant="h6">Chính sách</HighlightTypography>
            {["Bảo mật thông tin", "Vận chuyển", "Đổi trả", "Thanh toán"].map(
              (text) => (
                <Link
                  key={text}
                  href="#"
                  sx={{
                    display: "block",
                    py: 0.5,
                    color: "inherit",
                    transition: "color 0.2s",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {text}
                </Link>
              )
            )}
          </Stack>
        </Grid>

        {/* Liên hệ */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={2}>
            <HighlightTypography variant="h6">Liên hệ</HighlightTypography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <LocationOn fontSize="small" color="primary" />
                <Typography variant="body2">
                  Số 123, Đường Công nghệ, Q.1, TP.HCM
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Phone fontSize="small" color="primary" />
                <Typography variant="body2">1900 123 456</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Email fontSize="small" color="primary" />
                <Link
                  href="mailto:support@aiotech.cloud"
                  color="inherit"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  support@aiotech.cloud
                </Link>
              </Box>
            </Stack>

            <Stack spacing={2} direction="row">
              {[
                {
                  icon: <Facebook sx={{ fontSize: 28 }} />,
                  color: "#1877F2",
                  href: "https://www.facebook.com",
                },
                {
                  icon: <X sx={{ fontSize: 28 }} />,
                  color: "#000",
                  href: "https://x.com",
                },
                {
                  icon: <Instagram sx={{ fontSize: 28 }} />,
                  color: "#E4405F",
                  href: "https://instagram.com",
                },
                {
                  icon: <YouTube sx={{ fontSize: 28 }} />,
                  color: "#CD201F",
                  href: "https://youtube.com",
                },
              ].map((social, index) => (
                <IconButton
                  LinkComponent={Link}
                  href={social.href}
                  key={index}
                  sx={{
                    p: 1,
                    bgcolor: "background.paper",
                    "&:hover": {
                      bgcolor: social.color,
                      "& svg": { color: "white" },
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Grid>

        {/* Bản quyền */}
        <Grid
          size={12}
          sx={{ py: 1, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.7 }}>
            © {dayjs().year()} AioTech. Bảo lưu mọi quyền.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
