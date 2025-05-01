import {
    Textarea,
    TextareaProps
} from "@mantine/core";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type ControlledTextareaProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
} & Omit<TextareaProps, "name" | "onChange" | "value" | "error" | "helperText">;

export const ControlledTextarea = <T extends FieldValues>({
  control,
  name,
  ...props
}: ControlledTextareaProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ...restField } = field;
        return (
          <Textarea
            {...restField}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            error={error?.message}
            {...props}
          />
        );
      }}
    />
  );
};
