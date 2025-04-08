import { API_URL } from "@/constant/apiUrl";
import { getApi, postApi } from "@/lib/apiClient";
import { convertObjectToFormData, parseUUID } from "@/lib/utils";
import { ProfileFormData, profileSchema, UserProfileResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Button,
  FormLabel,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TextFieldElement, useForm } from "react-hook-form-mui";
import useSWR from "swr";
import { EmailChangeDialog } from "./EmailChangeDialog";

export const ProfileForm = () => {
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const userId = useMemo(() => session?.user?.id, [session?.user?.id]);

  const userFetcher = useCallback(async () => {
    const response = await getApi(API_URL.user + `/${userId}/profile`);
    if (response.success) {
      return response.data as UserProfileResponse;
    } else {
      throw new Error(response.message);
    }
  }, [userId]);

  const { data, isValidating, error } = useSWR<UserProfileResponse>(userId, {
    fetcher: userFetcher,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const { control, handleSubmit, setValue } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      familyName: data?.familyName,
      givenName: data?.givenName,
      phoneNumber: data?.phoneNumber,
      address: data?.address,
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("image", file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    const parsedId = parseUUID(userId || "");
    const extendedData = {
      ...data,
      id: parsedId,
    };
    const formData = convertObjectToFormData(extendedData);
    // TODO: Send formData to api
    postApi(API_URL.userProfile, formData).then((response) => {
      if (response.success) {
        enqueueSnackbar("Cập nhật tài khoản thành công", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Lỗi xảy ra: " + response.message, {
          variant: "error",
        });
      }
    });
  };

  useEffect(() => {
    if (data) {
      setValue("familyName", data.familyName);
      setValue("givenName", data.givenName);
      setValue("phoneNumber", data.phoneNumber);
      setValue("address", data.address);
      setAvatarPreview(data.avatarUrl);
    }
  }, [data, setValue]);

  if (error) {
    enqueueSnackbar("Lỗi xảy ra: " + error.message, { variant: "error" });
  }
  if (isValidating) return <div>Đang tải...</div>;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      {/* Avatar Section */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <input
          accept="image/*"
          id="avatar-upload"
          type="file"
          hidden
          onChange={handleAvatarChange}
        />
        <label htmlFor="avatar-upload">
          <IconButton component="span">
            <Avatar src={avatarPreview} sx={{ width: 100, height: 100 }} />
            <CloudUploadIcon
              sx={{ position: "absolute", bottom: 0, right: 0 }}
            />
          </IconButton>
        </label>
      </Box>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Box>
            <FormLabel htmlFor="familyName">Họ</FormLabel>
            <TextFieldElement control={control} name="familyName" fullWidth />
          </Box>
          <Box>
            <FormLabel htmlFor="givenName" required>
              Tên
            </FormLabel>
            <TextFieldElement
              control={control}
              name="givenName"
              required
              fullWidth
            />
          </Box>
          <Box>
            <FormLabel htmlFor="email" required>
              Email
            </FormLabel>
            <TextField
              name="email"
              fullWidth
              value={data?.email}
              disabled
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setEmailDialogOpen(true)}>
                    <EditIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Box>
            <FormLabel htmlFor="phoneNumber">Số điện thoại</FormLabel>
            <TextFieldElement control={control} name="phoneNumber" fullWidth />
          </Box>
          <Box>
            <FormLabel htmlFor="address" required>
              Địa chỉ
            </FormLabel>
            <TextFieldElement
              control={control}
              name="address"
              multiline
              minRows={2}
              required
              fullWidth
            />
          </Box>

          <Button type="submit" variant="contained" size="large">
            Lưu
          </Button>
        </Stack>
      </form>

      <EmailChangeDialog
        oldEmail={data?.email}
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
      />
    </Box>
  );
};
