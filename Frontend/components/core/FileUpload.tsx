import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Stack, Typography } from '@mui/material';
import { FileUploader } from 'react-drag-drop-files';

type FileUploadProps = {
  required?: boolean;
  multiple?: boolean;
  minSize?: number;
  maxSize?: number;
  name: string;
  fileTypes: string[];
  onChange: ((file: File) => void) | ((files: File[]) => void);
};

export const FileUpload = ({
  required = false,
  multiple = false,
  minSize,
  maxSize,
  name,
  fileTypes,
  onChange,
}: FileUploadProps) => {
  return (
    <FileUploader
      required={required}
      multiple={multiple}
      label='Tải lên hoặc kéo thả ảnh vào đây'
      uploadedLabel='Tải lên thành công'
      handleChange={onChange}
      minSize={minSize}
      maxSize={maxSize}
      types={fileTypes}
      name={name}>
      <Stack
        direction='row'
        gap={1}
        alignItems='center'
        sx={(theme) => ({
          padding: 1,
          border: 2,
          borderStyle: 'dashed',
          borderColor: theme.palette.primary.main,
        })}>
        <AddPhotoAlternateOutlinedIcon />
        <Stack>
          <Typography
            variant='caption'
            color='textSecondary'
            sx={{
              cursor: 'pointer',
            }}>
            Tải lên hoặc kéo thả ảnh vào đây
          </Typography>
          <Typography
            variant='caption'
            color='textDisabled'
            sx={{
              cursor: 'pointer',
            }}>
            Hỗ trợ {fileTypes.join(', ')}
          </Typography>
        </Stack>
      </Stack>
    </FileUploader>
  );
};
