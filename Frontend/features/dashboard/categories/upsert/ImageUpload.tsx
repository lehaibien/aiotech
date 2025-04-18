import { FileUpload } from '@/components/core/FileUpload';
import { IMAGE_TYPES } from '@/constant/common';
import { Stack } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  image?: File | undefined;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, image }) => {
  const handleFileChange = (file: File) => {
    onUpload(file);
  };
  return (
    <Stack spacing={2}>
      <FileUpload
        required
        onChange={handleFileChange}
        maxSize={10}
        name='files'
        fileTypes={IMAGE_TYPES}
      />
      {image && (
        <Image
          src={URL.createObjectURL(image) || '/image-not-found.jpg'}
          alt={`Uploaded`}
          width={300}
          height={0}
          style={{
            width: 'auto',
            height: 'auto',
            aspectRatio: 4 / 3,
            objectFit: 'fill',
            backgroundColor: 'white',
          }}
        />
      )}
    </Stack>
  );
};

export default React.memo(ImageUpload, (prev, next) => {
  if (
    prev.image?.name === next.image?.name &&
    prev.image?.size === next.image?.size
  ) {
    return true;
  }
  return false;
});
