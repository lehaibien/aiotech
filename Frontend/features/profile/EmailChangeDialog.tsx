import { emailSchema } from "@/schemas/userSchema";
import { EmailFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";

type EmailChangeDialogProps = {
  oldEmail?: string;
  open: boolean;
  onClose: () => void;
};

export const EmailChangeDialog = ({
  oldEmail,
  open,
  onClose,
}: EmailChangeDialogProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const handleEmailChange = (data: EmailFormData) => {
    // TODO: Implement email change logic
    console.log("New email:", data.email);
    onClose();
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Thay đổi địa chỉ email"
      size="md"
    >
      <Stack component="form" onSubmit={handleSubmit(handleEmailChange)}>
        <TextInput
          label="Địa chỉ email cũ"
          name="oldEmail"
          type="email"
          value={oldEmail}
          disabled
          size="sm"
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Địa chỉ email mới"
              name="email"
              type="email"
              size="sm"
              error={errors.email?.message}
            />
          )}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" color="blue">
            Lưu
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
