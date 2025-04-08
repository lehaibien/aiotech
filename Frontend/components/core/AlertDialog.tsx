import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ErrorIcon from "@mui/icons-material/Error";

type AlertDialogProps = {
  children: React.ReactNode;
  title: string;
  content: string;
  onBeforeShow?: () => boolean;
  onBeforeConfirm?: () => boolean;
  onConfirm: () => void;
};

export default function AlertDialog({
  children,
  title,
  content,
  onBeforeShow,
  onBeforeConfirm,
  onConfirm,
}: AlertDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    const isValid = onBeforeShow ? onBeforeShow() : true;
    if (isValid) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    const isValid = onBeforeConfirm ? onBeforeConfirm() : true;
    if (isValid) {
      onConfirm();
      setOpen(false);
    }
  };

  return (
    <React.Fragment>
      <span onClick={handleClickOpen}>{children}</span>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={(theme) => ({
          border: `1px solid ${theme.palette.error.main}`,
        })}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <ErrorIcon color="error" />
          <span style={{ marginLeft: 8 }}>{title}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleConfirm} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
