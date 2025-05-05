import { ComboBoxItem } from "@/types";
import { Select, SelectProps } from "@mantine/core";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type ControlledSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  options: ComboBoxItem[];
} & Omit<SelectProps, "value" | "onChange" | "error">;

export const ControlledSelect = <T extends FieldValues>({
  control,
  name,
  options,
  ...props
}: ControlledSelectProps<T>) => {
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
        return (
          <Select
            {...restField}
            data={transformedOptions}
            name={name}
            value={value?.toString()}
            onChange={onChange}
            error={error?.message}
            {...props}
          />
        );
      }}
    />
  );
};
