import { FileUpload } from "@/components/core/FileUpload";
import { IMAGE_TYPES } from "@/constant/common";
import { Divider, Stack } from "@mui/material";
import Image from "next/image";

type ThumbnailUploadProps = {
  image?: File;
  onUpload: (file: File) => void;
};

export const ThumbnailUpload = ({ image, onUpload }: ThumbnailUploadProps) => {
  const onChange = (file: File) => {
    onUpload(file);
  };

  return (
    <Stack spacing={2}>
      <FileUpload
        required
        onChange={onChange}
        maxSize={10}
        name="files"
        fileTypes={IMAGE_TYPES}
      />
      <Divider className="my-4" />
      {image && (
        <Image
          src={URL.createObjectURL(image) || "/placeholder.svg"}
          alt="Thumbnail"
          width={300}
          height={300}
          style={{
            maxWidth: 300,
            objectFit: "fill",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
          }}
        />
      )}
    </Stack>
  );
};
