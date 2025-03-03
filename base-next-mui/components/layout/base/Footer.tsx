import { Facebook, Instagram, X, YouTube } from "@mui/icons-material";
import { Box, Grid2 as Grid, Link, Typography } from "@mui/material";
import Image from "next/image";
import 'server-only';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        color: "text.secondary",
        mt: "auto",
        py: 2,
        px: 2,
      }}
    >
      <Grid container spacing={2} maxWidth="lg" mx="auto">
        {/* Về chúng tôi */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="h6" gutterBottom color="text.primary">
            AioTech
          </Typography>
          <Typography variant="body2">
            Hệ thống bán lẻ điện tử công nghệ hàng đầu Việt Nam
          </Typography>

          <Box mt={1}>
            {/* Thêm các icon phương thức thanh toán tại đây */}
            <Typography variant="body2">Hỗ trợ thanh toán:</Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Image
                  src="/vnpay-icon.svg"
                  alt="VNPay"
                  width={24}
                  height={24}
                />
                <span>VNPay</span>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Image src="/momo-icon.svg" alt="Momo" width={24} height={24} />
                <span>Momo</span>
              </Box>
            </Box>
            {/* Ví dụ: Visa, Mastercard, PayPal icons */}
          </Box>
        </Grid>

        {/* Hỗ trợ khách hàng */}
        <Grid size={{ xs: 6, md: 3 }}>
          <Typography variant="h6" gutterBottom color="text.primary">
            Hỗ trợ
          </Typography>
          <Link href="#" color="inherit" display="block">
            Trung tâm hỗ trợ
          </Link>
          <Link href="#" color="inherit" display="block">
            Hướng dẫn mua hàng
          </Link>
          <Link href="#" color="inherit" display="block">
            Tra cứu đơn hàng
          </Link>
          <Link href="#" color="inherit" display="block">
            Chính sách bảo hành
          </Link>
        </Grid>

        {/* Chính sách */}
        <Grid size={{ xs: 6, md: 3 }}>
          <Typography variant="h6" gutterBottom color="text.primary">
            Chính sách
          </Typography>
          <Link href="#" color="inherit" display="block" underline="hover">
            Bảo mật thông tin
          </Link>
          <Link href="#" color="inherit" display="block" underline="hover">
            Vận chuyển
          </Link>
          <Link href="#" color="inherit" display="block" underline="hover">
            Đổi trả
          </Link>
          <Link href="#" color="inherit" display="block" underline="hover">
            Thanh toán
          </Link>
        </Grid>

        {/* Liên hệ */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="h6" gutterBottom color="text.primary">
            Kết nối với chúng tôi
          </Typography>

          <Box display="flex" gap={2} mb={2}>
            <Link href="https://www.facebook.com/">
              <Facebook color="info" fontSize="large" />
            </Link>
            <Link href="https://x.com">
              <X color="action" fontSize="large" />
            </Link>
            <Link href="https://www.instagram.com/">
              <Instagram color="primary" fontSize="large" />
            </Link>
            <Link href="https://www.youtube.com/">
              <YouTube color="error" fontSize="large" />
            </Link>
          </Box>

          <Typography variant="body2" gutterBottom>
            {/* Địa chỉ: Số 123, Đường Công nghệ, Q.1, TP.HCM */}
            Địa chỉ: xxxxx
          </Typography>
          <Typography variant="body2" gutterBottom>
            Hotline: xxxxxxxx
          </Typography>
          <Typography variant="body2">Email: support@aiotech.vn</Typography>
        </Grid>

        {/* Bản quyền */}
        <Grid size={12}>
          <Typography variant="body2" textAlign="center">
            © {new Date().getFullYear()} AioTech.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
