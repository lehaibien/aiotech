"use client";

import { API_URL } from "@/constant/apiUrl";
import { TAX_VALUE } from "@/constant/common";
import { postApi } from "@/lib/apiClient";
import { cartItemsAtom } from "@/lib/globalState";
import { formatNumberWithSeperator, parseUUID } from "@/lib/utils";
import { checkoutFormSchema } from "@/schemas/orderSchema";
import { CheckoutFormInput, CheckoutRequest, PaymentMethods } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type CheckoutComponentProps = {
  name: string;
  phoneNumber: string;
  address: string;
  isError: boolean;
};

export const CheckoutComponent = ({
  name,
  phoneNumber,
  address,
  isError = false,
}: CheckoutComponentProps) => {
  const theme = useTheme();
  const router = useRouter();
  const [cartItems] = useAtom(cartItemsAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    isError ? "Lỗi xảy ra khi thanh toán, vui lòng thử lại sau!" : null
  );

  const cartTotal = useMemo(
    () =>
      Math.round(
        cartItems.reduce(
          (acc, item) => acc + item.productPrice * item.quantity,
          0
        )
      ),
    [cartItems]
  );

  const { data: session } = useSession();
  const userId = useMemo(() => session?.user?.id, [session?.user?.id]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: name,
      phoneNumber: phoneNumber,
      address: address,
      provider: PaymentMethods.VNPAY,
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<CheckoutFormInput> = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (userId) {
        const orderData: CheckoutRequest = {
          customerId: userId,
          name: data.name,
          phoneNumber: data.phoneNumber,
          address: data.address,
          note: data.note,
          tax: cartTotal * TAX_VALUE,
          totalPrice: cartTotal * (1 + TAX_VALUE),
          orderItems: cartItems.map((item) => ({
            productId: parseUUID(item.productId),
            quantity: item.quantity,
            price: item.productPrice,
          })),
          provider: Number(data.provider), // Convert provider to a number
        };

        if (orderData.provider === PaymentMethods.MOMO) {
          const response = await postApi(API_URL.createOrderUrl, orderData);
          if (!response.success) {
            setError(response.message || "Có lỗi xảy ra khi xử lý đơn hàng");
            console.error(response.message);
          } else {
            router.push(response.data as string);
          }
          return;
        }
        if (orderData.provider === PaymentMethods.VNPAY) {
          const response = await postApi(API_URL.createOrderUrl, orderData);
          if (!response.success) {
            setError(response.message || "Có lỗi xảy ra khi xử lý đơn hàng");
            console.error(response.message);
          } else {
            router.push(response.data as string);
          }
        }
      } else {
        setError("Vui lòng đăng nhập để tiếp tục thanh toán");
      }
    } catch (error) {
      setError(`Thanh toán thất bại: ${(error as Error).message}`);
      console.error("Thanh toán thất bại: ", (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          {/* Shipping Information */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 2,
                mb: 2,
                p: 3,
                borderRadius: 2,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalShippingOutlinedIcon
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: 28,
                  }}
                />
                <Typography variant="h5" fontWeight="500">
                  Thông tin giao hàng
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    {...register("phoneNumber")}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    {...register("address")}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    multiline
                    rows={3}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Ghi chú (tùy chọn)"
                    {...register("note")}
                    error={!!errors.note}
                    helperText={errors.note?.message}
                    multiline
                    rows={2}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 2,
                p: 3,
                borderRadius: 2,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PaymentOutlinedIcon
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: 28,
                  }}
                />
                <Typography variant="h5" fontWeight="500">
                  Phương thức thanh toán
                </Typography>
              </Box>

              <Controller
                name="provider"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    value={field.value?.toString()}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                      }}
                    >
                      <Paper
                        elevation={field.value === PaymentMethods.MOMO ? 3 : 1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border:
                            field.value === PaymentMethods.MOMO
                              ? `2px solid ${theme.palette.primary.main}`
                              : `1px solid ${alpha(
                                  theme.palette.divider,
                                  0.5
                                )}`,
                          flex: 1,
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: theme.palette.primary.light,
                          },
                        }}
                        onClick={() => field.onChange(PaymentMethods.MOMO)}
                      >
                        <FormControlLabel
                          value={PaymentMethods.MOMO.toString()}
                          control={<Radio />}
                          label={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Image
                                src="/momo-icon.svg"
                                alt="Momo"
                                width={32}
                                height={32}
                              />
                              <Typography fontWeight="500">Ví Momo</Typography>
                            </Box>
                          }
                          sx={{ m: 0 }}
                        />
                      </Paper>

                      <Paper
                        elevation={field.value === PaymentMethods.VNPAY ? 3 : 1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border:
                            field.value === PaymentMethods.VNPAY
                              ? `2px solid ${theme.palette.primary.main}`
                              : `1px solid ${alpha(
                                  theme.palette.divider,
                                  0.5
                                )}`,
                          flex: 1,
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: theme.palette.primary.light,
                          },
                        }}
                        onClick={() => field.onChange(PaymentMethods.VNPAY)}
                      >
                        <FormControlLabel
                          value={PaymentMethods.VNPAY.toString()}
                          control={<Radio />}
                          label={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Image
                                src="/vnpay-icon.svg"
                                alt="VNPay"
                                width={32}
                                height={32}
                              />
                              <Typography fontWeight="500">VNPay</Typography>
                            </Box>
                          }
                          sx={{ m: 0 }}
                        />
                      </Paper>
                    </Box>
                  </RadioGroup>
                )}
              />
              {errors.provider && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {errors.provider.message}
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 2,
                p: 3,
                borderRadius: 2,
                position: "sticky",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ShoppingBagOutlinedIcon
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: 28,
                  }}
                />
                <Typography variant="h5" fontWeight="500">
                  Tổng quan đơn hàng
                </Typography>
              </Box>

              <Box sx={{ overflowY: "auto" }}>
                <Stack spacing={2}>
                  {cartItems.map((item) => (
                    <Card
                      key={item.productId}
                      elevation={0}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        borderRadius: 2,
                      }}
                    >
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={60}
                        height={60}
                        style={{ borderRadius: 8, objectFit: "cover" }}
                      />
                      <Box sx={{ ml: 2, flex: 1 }}>
                        <Typography variant="body1" fontWeight="500">
                          {item.productName}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {formatNumberWithSeperator(item.productPrice)} đ
                          </Typography>
                          <Chip
                            label={`x${item.quantity}`}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                            }}
                          />
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Tạm tính:</Typography>
                  <Typography fontWeight="500">
                    {formatNumberWithSeperator(cartTotal)} đ
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">
                    Thuế GTGT ({TAX_VALUE * 100}%):
                  </Typography>
                  <Typography fontWeight="500">
                    {formatNumberWithSeperator(
                      Number((cartTotal * TAX_VALUE).toFixed(2))
                    )}{" "}
                    đ
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography variant="h6">Tổng cộng:</Typography>
                  <Typography variant="h6" color="primary.main">
                    {formatNumberWithSeperator(
                      Number((cartTotal * (1 + TAX_VALUE)).toFixed(2))
                    )}{" "}
                    đ
                  </Typography>
                </Box>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                data-umami-event="Thanh toán"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Thanh toán"
                )}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
