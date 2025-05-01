import { ComboBoxItem } from "@/types";
import {
  Flex,
  Radio,
  RadioGroup,
  RadioGroupProps,
  StyleProp,
} from "@mantine/core";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type ControlledRadioGroupProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  options: ComboBoxItem[];
  direction: StyleProp<"column" | "row">;
} & Omit<RadioGroupProps, "value" | "onChange" | "children">;

export const ControlledRadioGroup = <T extends FieldValues>({
  control,
  name,
  options,
  direction,
  ...props
}: ControlledRadioGroupProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <RadioGroup
          {...field}
          value={field.value?.toString()}
          onChange={(value) => field.onChange(Number(value))}
          error={error ? error.message : undefined}
          {...props}
        >
          <Flex gap={4} direction={direction}>
            {options.map((option) => (
              <Radio
                key={option.value}
                value={option.value.toString()}
                label={option.text}
              />
            ))}
          </Flex>
        </RadioGroup>
      )}
    />
  );
};
