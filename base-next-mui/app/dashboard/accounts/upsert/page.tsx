import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { AccountUpsertForm } from "@/features/dashboard/accounts/AccountUpsertForm";
import { getApi, getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ComboBoxItem, UserRequest, UserResponse } from "@/types";
import { Card, Typography } from "@mui/material";
import "server-only";

export default async function AccountUpsertPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const uuid = parseUUID(searchParams?.id ?? "");
  let data: UserResponse = {
    id: EMPTY_UUID,
    userName: "",
    familyName: "",
    givenName: "",
    email: "",
    phoneNumber: "",
    avatarUrl: "",
    roleId: EMPTY_UUID,
    fullName: "",
    role: "",
    createdDate: new Date(),
    createdBy: "",
  };
  let roleCombobox: ComboBoxItem[] = [];

  if (uuid !== EMPTY_UUID) {
    const response = await getByIdApi(API_URL.user, { id: uuid });
    if (response.success) {
      const userData = response.data as UserRequest;
      data = {
        ...data,
        id: parseUUID(userData.id ?? ""),
        userName: userData.userName,
        givenName: userData.givenName,
        familyName: userData.familyName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        roleId: parseUUID(userData.roleId ?? ""),
      };
    } else {
      console.error(response.message);
    }
  }

  const roleComboboxResponse = await getApi(API_URL.roleComboBox);
  if (roleComboboxResponse.success) {
    roleCombobox = roleComboboxResponse.data as ComboBoxItem[];
  } else {
    console.error("Get role combobox error: " + roleComboboxResponse.message);
  }

  return (
    <Card
      variant="outlined"
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        {uuid === null || uuid === EMPTY_UUID ? "Thêm mới" : "Cập nhật"} tài
        khoản
      </Typography>
      <AccountUpsertForm data={data} roleCombobox={roleCombobox} />
    </Card>
  );
}
