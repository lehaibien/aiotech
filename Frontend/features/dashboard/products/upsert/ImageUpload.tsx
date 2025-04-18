'use client';

import { FileUpload } from '@/components/core/FileUpload';
import { IMAGE_TYPES } from '@/constant/common';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Divider,
  ImageList,
  ImageListItem,
  Stack
} from '@mui/material';
import Image from 'next/image';

type ImageUploadProps = {
  images: File[];
  onUpload: (files: File[]) => void;
  onDelete: (index: number) => void;
};

export const ImageUpload = ({
  images,
  onUpload,
  onDelete,
}: ImageUploadProps) => {
  const handleFileChange = (files: File[]) => {
    onUpload(Array.from(files));
  };

  return (
    <Stack spacing={2}>
      <FileUpload
        required
        multiple
        onChange={handleFileChange}
        maxSize={10}
        name='files'
        fileTypes={IMAGE_TYPES}
      />
      <Divider className='my-4' />
      {images.length > 0 && (
        <ImageList
          sx={{ width: '100%' }}
          cols={2}
          rowHeight='auto'>
          {images.map((image, index) => (
            <ImageListItem
              key={index}
              sx={{ aspectRatio: '1/1', position: 'relative' }}>
              <DeleteOutlineOutlinedIcon
                color='error'
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  cursor: 'pointer',
                }}
                onClick={() => onDelete(index)}
              />
              <Image
                src={URL.createObjectURL(image) || '/placeholder.svg'}
                alt={`Uploaded ${index + 1}`}
                loading='lazy'
                width={200}
                height={200}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'white',
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Stack>
  );
};
