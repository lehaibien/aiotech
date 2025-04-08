import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormLabel,
  Box,
} from "@mui/material";
import { EmailFormData, emailSchema } from "@/types";

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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thay đổi địa chỉ email</DialogTitle>
      <form onSubmit={handleSubmit(handleEmailChange)}>
        <DialogContent>
          <Box>
            <FormLabel htmlFor="oldEmail">Địa chỉ email cũ</FormLabel>
            <TextField
              autoFocus
              margin="dense"
              name="oldEmail"
              type="email"
              value={oldEmail}
              disabled
              fullWidth
            />
          </Box>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <>
                <FormLabel htmlFor="email">Địa chỉ email mới</FormLabel>
                <TextField
                  {...field}
                  autoFocus
                  margin="dense"
                  name="email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="secondary">
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
