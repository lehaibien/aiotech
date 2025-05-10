import { ComboBoxItem } from "@/types";
import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type ControlledMultipleComboboxProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  options: ComboBoxItem[];
  label?: string;
  required?: boolean;
} & Omit<MultiSelectProps, "value" | "onChange" | "error" | "data">;

export const ControlledMultipleCombobox = <T extends FieldValues>({
  control,
  name,
  options,
  label,
  required,
  ...props
}: ControlledMultipleComboboxProps<T>) => {
  // Transform options to format expected by MultiSelect
  const transformedOptions = options.map((option) => ({
    label: option.text,
    value: option.value,
  }));

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ...restField } = field;

        // Normalize the value to ensure it's always an array
        const normalizedValue: string[] = Array.isArray(value) ? value : [];

        return (
          <MultiSelect
            {...restField}
            data={transformedOptions}
            value={normalizedValue}
            onChange={onChange}
            error={error?.message}
            label={label}
            required={required}
            placeholder="Tìm kiếm..."
            searchable
            nothingFoundMessage="Không có kết quả"
            {...props}
          />
        );
      }}
    />
  );
};