"use client";

import { ControlledTextarea } from "@/components/form/ControlledTextarea";
import { ControlledTextInput } from "@/components/form/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { TAX_VALUE } from "@/constant/common";
import { useUserId } from "@/hooks/useUserId";
import { postApi } from "@/lib/apiClient";
import { cartItemsAtom } from "@/lib/globalState";
import { formatNumberWithSeperator, parseUUID } from "@/lib/utils";
import { checkoutFormSchema } from "@/schemas/orderSchema";
import { CheckoutFormInput, CheckoutRequest, PaymentMethods } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useAtom } from "jotai";
import { Check, CreditCard, ShoppingBag, Truck } from "lucide-react";
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
  const userId = useUserId();
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
          provider: Number(data.provider),
        };

        const response = await postApi(API_URL.createOrderUrl, orderData);
        if (!response.success) {
          setError(response.message || "Có lỗi xảy ra khi xử lý đơn hàng");
          console.error(response.message);
        } else {
          router.push(response.data as string);
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
        <Alert c="red" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid>
          <Grid.Col
            span={{
              xs: 12,
              md: 7,
            }}
          >
            <Stack>
              <Group gap='sm'>
                <Truck />
                <Title order={5}>Thông tin giao hàng</Title>
              </Group>

              <Grid>
                <Grid.Col span={{ xs: 12, md: 6 }}>
                  <ControlledTextInput
                    control={control}
                    name="name"
                    label="Họ và tên"
                    autoComplete="name"
                    required
                  />
                </Grid.Col>
                <Grid.Col span={{ xs: 12, md: 6 }}>
                  <ControlledTextInput
                    control={control}
                    name="phoneNumber"
                    label="Số điện thoại"
                    type="tel"
                    autoComplete="tel"
                    required
                  />
                </Grid.Col>
                <Grid.Col span={{ xs: 12 }}>
                  <ControlledTextarea
                    required
                    control={control}
                    name="address"
                    rows={2}
                    label="Địa chỉ"
                    placeholder="Số nhà, tên đường, phường, quận, thành phố"
                    autoComplete="address-line1"
                  />
                </Grid.Col>
                <Grid.Col span={{ xs: 12 }}>
                  <ControlledTextarea
                    control={control}
                    name="note"
                    rows={2}
                    label="Ghi chú (tùy chọn)"
                  />
                </Grid.Col>
              </Grid>
              <Group gap='sm'>
                <CreditCard />
                <Title order={5}>Phương thức thanh toán</Title>
              </Group>

              <Controller
                name="provider"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    value={field.value?.toString()}
                    onChange={(value) => field.onChange(Number(value))}
                    error={errors.provider?.message?.toString()}
                  >
                    <Grid>
                      {[
                        {
                          value: PaymentMethods.VNPAY,
                          text: "Thanh toán qua VNPAY",
                          icon: "./vnpay-icon.svg",
                        },
                        {
                          value: PaymentMethods.MOMO,
                          text: "Thanh toán qua MOMO",
                          icon: "./momo-icon.svg",
                        },
                      ].map((option) => (
                        <Grid.Col
                          key={option.value}
                          span={{
                            base: 12,
                            md: 4,
                          }}
                          p={4}
                        >
                          <Radio.Card
                            key={option.value}
                            value={option.value.toString()}
                          >
                            <Flex gap='sm' align="center" p='sm'>
                              <Radio.Indicator icon={Check} />
                              <Image
                                src={option.icon}
                                alt={option.text}
                                width={24}
                                height={24}
                              />
                              <Text size="sm">{option.text}</Text>
                            </Flex>
                          </Radio.Card>
                        </Grid.Col>
                      ))}
                    </Grid>
                  </RadioGroup>
                )}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ xs: 12, md: 5 }}>
            <Stack>
              <Group gap='sm'>
                <ShoppingBag />
                <Title order={5}>Tổng quan đơn hàng</Title>
              </Group>

              <Box>
                <Stack>
                  {cartItems.map((item) => (
                    <Card key={item.productId}>
                      <Group wrap="nowrap" gap='sm'>
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          width={60}
                          height={60}
                          style={{ borderRadius: 8, objectFit: "cover" }}
                        />
                        <Text>{item.productName}</Text>
                        <Badge color="blue" miw={48}>
                          x{item.quantity}
                        </Badge>
                        <Text>
                          {formatNumberWithSeperator(item.productPrice)}
                          {""}đ
                        </Text>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Stack>
                <Group justify="space-between">
                  <Text>Tạm tính:</Text>
                  <Text>{formatNumberWithSeperator(cartTotal)} đ</Text>
                </Group>
                <Group justify="space-between">
                  <Text>Thuế GTGT ({TAX_VALUE * 100}%):</Text>
                  <Text>
                    {formatNumberWithSeperator(
                      Number((cartTotal * TAX_VALUE).toFixed(2))
                    )}{" "}
                    đ
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text>Tổng cộng:</Text>
                  <Text c="red">
                    {formatNumberWithSeperator(
                      Number((cartTotal * (1 + TAX_VALUE)).toFixed(2))
                    )}{" "}
                    đ
                  </Text>
                </Group>
              </Stack>

              <Button
                type="submit"
                variant="filled"
                fullWidth
                size="sm"
                data-umami-event="Thanh toán"
                disabled={isSubmitting || !isValid}
                loading={isSubmitting}
              >
                Thanh toán
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </form>
    </Box>
  );
};
