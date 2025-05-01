import { NumberInput, NumberInputProps } from "@mantine/core";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type ControlledNumberInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
} & Omit<
  NumberInputProps,
  "name" | "onChange" | "value" | "error" | "helperText"
>;

export const ControlledNumberInput = <T extends FieldValues>({
  control,
  name,
  ...props
}: ControlledNumberInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ...restField } = field;
        const handleChange = (value: string | number) => {
          onChange(Number(value));
        };
        return (
          <NumberInput
            {...restField}
            name={name}
            value={value ?? ""}
            onChange={handleChange}
            error={error?.message}
            {...props}
          />
        );
      }}
    />
  );
};
