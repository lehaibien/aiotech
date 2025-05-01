"use client";

import { ControlledTextField } from "@/components/core/ControlledTextField";
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
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
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
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: name,
      phoneNumber: phoneNumber,
      address: address,
      provider: PaymentMethods.VNPAY,
    },
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
        <Grid container spacing={4} component={Paper}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2} padding={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalShippingOutlinedIcon
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: 28,
                  }}
                />
                <Typography variant="h5">Thông tin giao hàng</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack>
                    <FormLabel htmlFor="name" required>
                      Họ và tên
                    </FormLabel>
                    <ControlledTextField
                      control={control}
                      name="name"
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack>
                    <FormLabel htmlFor="phoneNumber" required>
                      Số điện thoại
                    </FormLabel>
                    <ControlledTextField
                      control={control}
                      name="phoneNumber"
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Stack>
                    <FormLabel htmlFor="address" required>
                      Địa chỉ
                    </FormLabel>
                    <ControlledTextField
                      control={control}
                      name="address"
                      variant="outlined"
                      multiline
                      rows={2}
                      size="small"
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Stack>
                    <FormLabel htmlFor="note">Ghi chú (tùy chọn)</FormLabel>
                    <ControlledTextField
                      control={control}
                      name="note"
                      variant="outlined"
                      multiline
                      rows={2}
                      size="small"
                    />
                  </Stack>
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PaymentOutlinedIcon
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: 28,
                  }}
                />
                <Typography variant="h5">Phương thức thanh toán</Typography>
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
                      <Box onClick={() => field.onChange(PaymentMethods.MOMO)}>
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
                              <Typography>Ví Momo</Typography>
                            </Box>
                          }
                        />
                      </Box>

                      <Box onClick={() => field.onChange(PaymentMethods.VNPAY)}>
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
                              <Typography>VNPay</Typography>
                            </Box>
                          }
                        />
                      </Box>
                    </Box>
                  </RadioGroup>
                )}
              />
              {errors.provider && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {errors.provider.message}
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2} padding={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ShoppingBagOutlinedIcon
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: 28,
                  }}
                />
                <Typography variant="h5">Tổng quan đơn hàng</Typography>
              </Box>

              <Box sx={{ overflowY: "auto" }}>
                <Stack spacing={2}>
                  {cartItems.map((item) => (
                    <Card
                      key={item.productId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 2,
                        gap: 2,
                      }}
                    >
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={60}
                        height={60}
                        style={{ borderRadius: 8, objectFit: "cover" }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1">
                          {item.productName}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2">
                            {formatNumberWithSeperator(item.productPrice)} đ
                          </Typography>
                          <Chip
                            label={`x${item.quantity}`}
                            size="small"
                            color="primary"
                          />
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Stack spacing={1}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Tạm tính:</Typography>
                  <Typography>
                    {formatNumberWithSeperator(cartTotal)} đ
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="textSecondary">
                    Thuế GTGT ({TAX_VALUE * 100}%):
                  </Typography>
                  <Typography>
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
                  }}
                >
                  <Typography variant="h6">Tổng cộng:</Typography>
                  <Typography variant="h6" color="error">
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
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
