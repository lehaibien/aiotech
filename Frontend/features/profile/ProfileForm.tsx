"use client";

import { ControlledTextarea } from "@/components/form/ControlledTextarea";
import { ControlledTextInput } from "@/components/form/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { useUserId } from "@/hooks/useUserId";
import { postApi } from "@/lib/apiClient";
import { convertObjectToFormData, parseUUID } from "@/lib/utils";
import { profileSchema } from "@/schemas/userSchema";
import { ProfileFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  Grid,
  Stack,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { CloudUpload, Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { EmailChangeDialog } from "./EmailChangeDialog";

type ProfileFormProps = {
  /*
  setValue("familyName", data.familyName);
      setValue("givenName", data.givenName);
      setValue("phoneNumber", data.phoneNumber);
      setValue("address", data.address);
      setAvatarPreview(data.avatarUrl === "" ? undefined : data.avatarUrl);
  */
  familyName: string;
  givenName: string;
  email: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string;
};

export const ProfileForm = ({
  familyName,
  givenName,
  email,
  phoneNumber,
  address,
  avatarUrl,
}: ProfileFormProps) => {
  const userId = useUserId();
  const [avatarPreview, setAvatarPreview] = useState<string>(avatarUrl);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const { control, handleSubmit, setValue } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      familyName: familyName,
      givenName: givenName,
      phoneNumber: phoneNumber,
      address: address,
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("image", file);
      setAvatarPreview(URL.createObjectURL(file));
      setIsImageChanged(true);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    const parsedId = parseUUID(userId || "");
    const extendedData = {
      ...data,
      id: parsedId,
      isImageEdited: isImageChanged,
    };
    const formData = convertObjectToFormData(extendedData);
    const response = await postApi(API_URL.userProfile, formData);
    if (response.success) {
      notifications.show({
        title: "Cập nhật thành công",
        message: "Cập nhật thông tin thành công",
        color: "green",
      });
      if (window) {
        window.location.reload();
      }
    } else {
      notifications.show({
        title: "Cập nhật thất bại",
        message: "Cập nhật thông tin thất bại",
        color: "red",
      });
    }
  };
  return (
    <Stack>
      <input
        accept="image/*"
        id="avatar-upload"
        type="file"
        hidden
        onChange={handleAvatarChange}
      />
      <Center>
        <label htmlFor="avatar-upload">
          <span
            style={{
              position: "relative",
              cursor: "pointer",
            }}
          >
            <Avatar src={avatarPreview} w={100} h={100} />

            <ActionIcon
              color="gray"
              variant="filled"
              radius="xl"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
              }}
            >
              <CloudUpload size={20} />
            </ActionIcon>
          </span>
        </label>
      </Center>
      <Grid component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid.Col span={{ xs: 12, sm: 6 }}>
          <ControlledTextInput
            control={control}
            name="familyName"
            size="sm"
            label="Họ"
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6 }}>
          <ControlledTextInput
            control={control}
            name="givenName"
            size="sm"
            required
            label="Tên"
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6 }}>
          <TextInput
            name="email"
            size="sm"
            value={email}
            disabled
            rightSection={
              <ActionIcon
                color="dark"
                variant="transparent"
                onClick={() => setEmailDialogOpen(true)}
              >
                <Edit size={20} />
              </ActionIcon>
            }
            required
            label="Email"
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6 }}>
          <ControlledTextInput
            control={control}
            name="phoneNumber"
            size="sm"
            label="Số điện thoại"
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <ControlledTextarea
            control={control}
            name="address"
            size="sm"
            rows={2}
            label="Địa chỉ"
          />
        </Grid.Col>
      </Grid>
      <Button w="25%" type="submit" variant="filled">
        Lưu
      </Button>

      <EmailChangeDialog
        oldEmail={email}
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
      />
    </Stack>
  );
};
