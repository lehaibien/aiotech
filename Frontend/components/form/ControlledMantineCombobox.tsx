import { ComboBoxItem } from "@/types";
import { Combobox, ComboboxProps, Input, useCombobox } from "@mantine/core";
import { useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type ControlledComboboxProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  options: ComboBoxItem[];
  label?: string;
  required?: boolean;
} & Omit<ComboboxProps, "value" | "onChange" | "error">;

export const ControlledCombobox = <T extends FieldValues>({
  control,
  name,
  options,
  label,
  required,
  ...props
}: ControlledComboboxProps<T>) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === "keyboard") {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex("active");
      }
    },
  });
  const [search, setSearch] = useState(() => {
    const defaultValue = String(control._defaultValues[name]);
    const selectedOption = options.find((item) => item.value.toString().toLowerCase() === (defaultValue || '').toLowerCase());
    return selectedOption ? selectedOption.text : "";
  });
  const shouldFilterOptions = options.every((item) => item.text !== search);
  const filteredOptions = shouldFilterOptions
    ? options.filter((item) =>
        item.text.toLowerCase().includes(search.toLowerCase().trim())
      )
    : options;
  const comboboxOptions = filteredOptions.map((option) => (
    <Combobox.Option key={option.value} value={option.value}>
      {option.text}
    </Combobox.Option>
  ));
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ...restField } = field;
        return (
          <Combobox
            store={combobox}
            onOptionSubmit={(optionValue) => {
              const selectedOption = options.find(
                (item) => item.value === optionValue
              );
              onChange(optionValue);
              setSearch(selectedOption?.text || "");
              combobox.closeDropdown();
            }}
            {...props}
          >
            <Combobox.Target>
              <Input.Wrapper label={label} required={required}>
                <Input
                  {...restField}
                  rightSection={<Combobox.Chevron />}
                  rightSectionPointerEvents="none"
                  onClick={() => combobox.openDropdown()}
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => {
                    combobox.closeDropdown();
                    const selectedOption = options.find(
                      (item) => item.value.toString().toLowerCase() === (value || '').toString().toLowerCase()
                    );
                    if (selectedOption) {
                      setSearch(selectedOption.text);
                    }
                  }}
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={(event) => {
                    combobox.updateSelectedOptionIndex();
                    setSearch(event.currentTarget.value);
                  }}
                  error={error?.message}
                />
              </Input.Wrapper>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>
                {filteredOptions.length > 0 ? (
                  comboboxOptions
                ) : (
                  <Combobox.Empty>Không tìm thấy kết quả</Combobox.Empty>
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        );
      }}
    />
  );
};
