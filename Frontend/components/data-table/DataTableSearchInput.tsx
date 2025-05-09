import { TextInput } from "@mantine/core";
import { Search } from "lucide-react";

type DataTableSearchInputProps = {
  onChange: (searchTerm: string) => void;
};

export const DataTableSearchInput = ({
  onChange,
}: DataTableSearchInputProps) => {
  return (
    <TextInput
      placeholder="Tìm kiếm"
      size="sm"
      radius="sm"
      w={250}
      leftSection={<Search />}
      onChange={(e) => onChange(e.target.value.trim())}
    />
  );
};
