import AlertDialog from "@/components/core/AlertDialog";
import { Button } from "@mui/material";

type ReviewSectionDeleteButtonProps = {
  index: number;
  handleDelete: (index: number) => void;
};

export function ReviewSectionDeleteButton({
  index,
  handleDelete,
}: ReviewSectionDeleteButtonProps) {
  return (
    <AlertDialog
      title={`Xóa đánh giá`}
      content={`Bạn có muốn xoá đánh giá này không?`}
      onConfirm={() => handleDelete(index)}
    >
      <Button size="small" color="error">
        Xóa
      </Button>
    </AlertDialog>
  );
}
