import { API_URL } from "@/constant/apiUrl";
import { postApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ChangePasswordRequest, ChangePasswordSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, FormLabel, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { useMemo } from "react";
import { TextFieldElement, useForm } from "react-hook-form-mui";

// Change password
export function SecurityForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();
  const userId = useMemo(() => session?.user?.id, [session?.user?.id]);
  const { control, handleSubmit } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(ChangePasswordSchema),
  });
  const onSubmit = (data: ChangePasswordRequest) => {
    // TODO: Implement change password logic
    const parsedId = parseUUID(userId || "");
    const obj = {
      id: parsedId,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    postApi(API_URL.changePassword, obj)
      .then((res) => {
        if (res.success) {
          enqueueSnackbar("Cập nhật mật khẩu thành công", {
            variant: "success",
          });
          if(window) {
            window.location.reload();
          }
        } else {
          enqueueSnackbar(res.message, { variant: "error" });
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Box>
            <FormLabel htmlFor="oldPassword">Mật khẩu cũ</FormLabel>
            <TextFieldElement
              control={control}
              name="oldPassword"
              fullWidth
              type="password"
            />
          </Box>
          <Box>
            <FormLabel htmlFor="newPassword">Mật khẩu mới</FormLabel>
            <TextFieldElement
              control={control}
              name="newPassword"
              fullWidth
              type="password"
            />
          </Box>
          <Box>
            <FormLabel htmlFor="confirmNewPassword">
              Xác nhận mật khẩu
            </FormLabel>
            <TextFieldElement
              control={control}
              name="confirmNewPassword"
              fullWidth
              type="password"
            />
          </Box>
          <Button type="submit" variant="contained" size="medium">
            Lưu
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
