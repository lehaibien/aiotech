import { CheckCircle, Groups, Security, Update } from '@mui/icons-material';
import { Box, Grid2 as Grid, Typography } from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Giới thiệu - Công ty Công nghệ A-Tech',
  description:
    'Giới thiệu về công ty chuyên cung cấp linh kiện điện tử, PC, Laptop và phụ kiện gaming chất lượng cao',
};

export default function AboutPage() {
  return (
    <Box
      sx={{
        py: 1,
        px: { xs: 2, md: 4 },
        backgroundColor: 'background.paper',
      }}>
      <Typography
        variant='h2'
        sx={{
          textAlign: 'center',
          mb: 6,
        }}>
        Giới thiệu về AioTech
      </Typography>

      <Grid
        container
        spacing={6}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant='h3'
            sx={{
              mb: 3,
              color: 'primary.main',
            }}>
            Chào mừng đến với AioTech
          </Typography>
          <Typography
            variant='body1'
            sx={{ mb: 4, lineHeight: 1.7 }}>
            Chúng tôi đam mê cung cấp những sản phẩm mới nhất và tốt nhất về PC,
            linh kiện PC, laptop, và thiết bị chơi game. Sứ mệnh của chúng tôi
            là đảm bảo rằng mỗi khách hàng đều tìm thấy chính xác những gì họ
            cần để nâng cao trải nghiệm công nghệ của mình.
          </Typography>

          <Typography
            variant='h3'
            sx={{
              mb: 3,
              color: 'primary.main',
            }}>
            Chất lượng và dịch vụ khách hàng
          </Typography>
          <Typography
            variant='body1'
            sx={{ mb: 4, lineHeight: 1.7 }}>
            Tại AioTech, chúng tôi tin tưởng vào chất lượng và sự hài lòng của
            khách hàng. Chính vì vậy, chúng tôi chọn lọc kỹ lưỡng các sản phẩm
            và cung cấp dịch vụ xuất sắc để đảm bảo bạn có một trải nghiệm mua
            sắm suôn sẻ.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant='h3'
            sx={{
              mb: 3,
              color: 'primary.main',
            }}>
            Blog công nghệ
          </Typography>
          <Typography
            variant='body1'
            sx={{ mb: 4, lineHeight: 1.7 }}>
            Khám phá thế giới công nghệ qua
            <Link
              href='/blogs'
              passHref>
              <Typography
                sx={{
                  mx: 0.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}>
                blog chuyên sâu
              </Typography>
            </Link>
            của chúng tôi - nơi cập nhật những xu hướng mới nhất, đánh giá chi
            tiết sản phẩm, và bí kíp tối ưu hóa thiết bị. Chúng tôi mong muốn
            trở thành nguồn tham khảo đáng tin cậy cho mọi tín đồ công nghệ.
          </Typography>

          <Typography
            variant='h3'
            sx={{
              mb: 3,
              color: 'primary.main',
            }}>
            Dành cho mọi người
          </Typography>
          <Typography
            variant='body1'
            sx={{ mb: 4, lineHeight: 1.7 }}>
            Dù bạn là người đam mê công nghệ, game thủ chuyên nghiệp hay chỉ cần
            nâng cấp thiết bị làm việc, AioTech luôn có giải pháp phù hợp. Chúng
            tôi tự hào mang đến trải nghiệm mua sắm khác biệt dành riêng cho
            bạn.
          </Typography>
        </Grid>
      </Grid>

      {/* Keep existing Giá trị cốt lõi section unchanged */}
      <Box
        sx={{
          borderRadius: 4,
          p: 3,
        }}>
        <Typography
          variant='h4'
          component='h2'
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            color: 'primary.main',
          }}>
          Giá trị cốt lõi
        </Typography>

        <Grid
          container
          spacing={2}>
          {[
            {
              icon: (
                <CheckCircle
                  color='primary'
                  sx={{ fontSize: 40 }}
                />
              ),
              title: 'Chất lượng',
              content: 'Sản phẩm chính hãng, đảm bảo nguồn gốc xuất xứ rõ ràng',
            },
            {
              icon: (
                <Security
                  color='primary'
                  sx={{ fontSize: 40 }}
                />
              ),
              title: 'Tin cậy',
              content: 'Chính sách bảo hành lên đến 3 năm, hỗ trợ 24/7',
            },
            {
              icon: (
                <Update
                  color='primary'
                  sx={{ fontSize: 40 }}
                />
              ),
              title: 'Đổi mới',
              content: 'Cập nhật công nghệ mới nhất, đáp ứng mọi nhu cầu',
            },
            {
              icon: (
                <Groups
                  color='primary'
                  sx={{ fontSize: 40 }}
                />
              ),
              title: 'Cộng đồng',
              content: 'Đồng hành cùng các giải đấu và sự kiện gaming lớn',
            },
          ].map((value, index) => (
            <Grid
              size={{ xs: 12, md: 6 }}
              key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                }}>
                {value.icon}
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 600,
                    my: 2,
                    color: 'text.primary',
                  }}>
                  {value.title}
                </Typography>
                <Typography
                  variant='body1'
                  color='text.secondary'>
                  {value.content}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
