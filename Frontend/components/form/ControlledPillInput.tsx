import { Pill, PillsInput, PillsInputProps } from "@mantine/core";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type ControlledPillInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder?: string;
} & Omit<PillsInputProps, "value" | "onChange" | "error" | "onBlur">;

export const ControlledPillInput = <T extends FieldValues>({
  control,
  name,
  placeholder = "Nhập tên",
  ...props
}: ControlledPillInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ...restField } = field;
        return (
          <PillsInput
            {...props}
            error={error?.message}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const input = e.target as HTMLInputElement;
                if (input.value !== "") {
                  onChange([...value, input.value.trim()]);
                  input.value = "";
                }
              }
            }}
            {...restField}
          >
            <Pill.Group>
              {value.map((item: string, index: number) => (
                <Pill
                  key={index}
                  withRemoveButton
                  onRemove={() =>
                    onChange(value.filter((v: string) => v !== item))
                  }
                >
                  {item}
                </Pill>
              ))}
              <PillsInput.Field placeholder={placeholder} />
            </Pill.Group>
          </PillsInput>
        );
      }}
    />
  );
};
