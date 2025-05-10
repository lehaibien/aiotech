import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { UserUpsertForm } from "@/features/dashboard/users/UserUpsertForm";
import { getApi, getByIdApi } from "@/lib/apiClient";
import dayjs from "@/lib/extended-dayjs";
import { parseUUID } from "@/lib/utils";
import { ComboBoxItem, SearchParams, UserResponse } from "@/types";
import { Stack, Title } from "@mantine/core";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { id } = await searchParams;
  const uuid = parseUUID(id ?? "");
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
    createdDate: dayjs().toDate(),
    createdBy: "",
    isLocked: false,
  };
  let roleCombobox: ComboBoxItem[] = [];
  const roleComboboxResponse = await getApi(API_URL.roleComboBox);
  if (roleComboboxResponse.success) {
    roleCombobox = roleComboboxResponse.data as ComboBoxItem[];
  } else {
    console.error("Get role combobox error: " + roleComboboxResponse.message);
  }

  if (uuid !== EMPTY_UUID) {
    const response = await getByIdApi(API_URL.user, { id: uuid });
    if (response.success) {
      const userData = response.data as UserResponse;
      const roleId = roleCombobox.find(
        (item) => item.text.toLowerCase() === userData.role?.toLowerCase()
      )?.value;
      data = {
        ...data,
        id: parseUUID(userData.id ?? ""),
        userName: userData.userName,
        givenName: userData.givenName,
        familyName: userData.familyName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        roleId: parseUUID(roleId),
      };
    } else {
      console.error(response.message);
    }
  }

  return (
    <Stack>
      <Title order={5}>
        {data.id === EMPTY_UUID ? "Thêm mới" : "Cập nhật"} tài khoản
      </Title>
      <UserUpsertForm data={data} roleCombobox={roleCombobox} />
    </Stack>
  );
}
