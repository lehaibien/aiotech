import { FormLabel, FormLabelProps } from '@mui/material';

interface CustomFormLabelProps extends FormLabelProps {
  label: string;
}

export default function CustomFormLabel(props: CustomFormLabelProps) {
  return (
    <FormLabel {...props}>
      {props.label}
    </FormLabel>
  );
}
