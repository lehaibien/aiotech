import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, styled } from "@mui/material";
import { ChangeEvent } from "react";
interface ImageUploaderProp {
  name: string;
  width?: string | number;
  onChange: (files: FileList) => void;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ImageUploader({
  name,
  width,
  onChange,
}: ImageUploaderProp) {
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const arr = files ? Array.from(files) : [];
    if (arr.length === 0) return;
    // check if the file is image/jpeg, image/png, image/jpg
    const isImage = arr.every((file) =>
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    );
    if (!isImage) {
      alert("Chỉ chấp nhận ảnh định dạng jpeg, jpg, png");
      return;
    }
    onChange(event.target.files as FileList);
  };
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      sx={{
        width: width ?? "100%",
      }}
    >
      Tải ảnh lên
      <VisuallyHiddenInput
        name={name}
        type="file"
        onChange={handleUpload}
        accept="image/jpeg, image/png, image/jpg"
        multiple
      />
    </Button>
  );
}
