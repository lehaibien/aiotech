"use client";

import { API_URL } from "@/constant/apiUrl";
import { TAX_VALUE } from "@/constant/common";
import { postApi } from "@/lib/apiClient";
import { cartItemsAtom } from "@/lib/globalState";
import { formatNumberWithSeperator, parseUUID } from "@/lib/utils";
import {
  CheckoutFormInput,
  checkoutFormSchema,
  CheckoutRequest,
  PaymentMethods,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid2 as Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type CheckoutComponentProps = {
  name: string;
  phoneNumber: string;
  address: string;
};

export function CheckoutComponent({
  name,
  phoneNumber,
  address,
}: CheckoutComponentProps) {
  const [cartItems] = useAtom(cartItemsAtom);
  const cartTotal = Math.round(
    cartItems.reduce((acc, item) => acc + item.productPrice * item.quantity, 0)
  );
  const { data: session } = useSession();

  const userId = useMemo(() => session?.user?.id, [session?.user?.id]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
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
      if (userId) {
        const orderData: CheckoutRequest = {
          customerId: userId,
          name: data.name,
          phoneNumber: data.phoneNumber,
          address: data.address,
          note: data.note,
          totalPrice: cartTotal * (1 + TAX_VALUE),
          orderItems: cartItems.map((item) => ({
            productId: parseUUID(item.productId),
            quantity: item.quantity,
            price: item.productPrice,
          })),
          provider: Number(data.provider), // Convert provider to a number
        };

        if (orderData.provider === PaymentMethods.MOMO) {
          // Handle Momo integration
        } else if (orderData.provider === PaymentMethods.VNPAY) {
          const response = await postApi(API_URL.createOrderUrl, orderData);
          if (!response.success) {
            console.error(response.message);
            return;
          } else {
            router.push(response.data as string);
          }
        }
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        {/* Shipping Information */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin giao hàng
          </Typography>

          <Stack>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  {...register("phoneNumber")}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
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
                  rows={3}
                />
              </Grid>
            </Grid>
          </Stack>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Phương thức thanh toán
          </Typography>

          <Controller
            name="provider"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                value={field.value?.toString()} // Convert the value to a string for the radio group
                onChange={(e) => field.onChange(Number(e.target.value))} // Convert back to number on change
              >
                <Box display="flex" gap={2}>
                  <FormControlLabel
                    value={PaymentMethods.MOMO.toString()} // Convert enum value to string
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Image
                          src="/momo-icon.svg"
                          alt="Momo"
                          width={24}
                          height={24}
                        />
                        <span>Ví Momo</span>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value={PaymentMethods.VNPAY.toString()} // Convert enum value to string
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Image
                          src="/vnpay-icon.svg"
                          alt="VNPay"
                          width={24}
                          height={24}
                        />
                        <span>VNPay</span>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value={PaymentMethods.COD.toString()} // Convert enum value to string
                    control={<Radio />}
                    disabled
                    sx={{ display: "none" }}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Image
                          src="/vnpay-icon.svg"
                          alt="VNPay"
                          width={24}
                          height={24}
                        />
                        <span>COD</span>
                      </Box>
                    }
                  />
                </Box>
              </RadioGroup>
            )}
          />
          {errors.provider && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.provider.message}
            </Typography>
          )}
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" gutterBottom>
            Tổng quan đơn hàng
          </Typography>

          <Stack spacing={2}>
            {cartItems.map((item) => (
              <Box
                key={item.productId}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  width={75}
                  height={75}
                  style={{ borderRadius: 4 }}
                />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body1">
                    {item.productName} x {item.quantity}
                  </Typography>
                  <Typography variant="caption">
                    {formatNumberWithSeperator(item.productPrice)} đ
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Grid>
        <Divider sx={{ width: "100%" }} />
        <Box width="100%">
          <Stack spacing={1} alignItems="flex-end">
            <Typography variant="body1">
              Tổng tiền hàng: {formatNumberWithSeperator(cartTotal)} đ
            </Typography>
            <Typography variant="body1">Phí vận chuyển: 0đ</Typography>
            <Typography variant="body1">
              Thuế GTGT:{" "}
              {formatNumberWithSeperator(Math.round(cartTotal * TAX_VALUE))} đ (
              {TAX_VALUE * 100}%)
            </Typography>
            <Typography variant="h6">
              Tổng cộng:{" "}
              {formatNumberWithSeperator(
                Math.round(cartTotal * (1 + TAX_VALUE))
              )}{" "}
              đ
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              size="medium"
              sx={{
                mt: 2,
                width: "35%",
              }}
            >
              Đặt hàng
            </Button>
          </Stack>
        </Box>
      </Grid>
    </form>
  );
}
