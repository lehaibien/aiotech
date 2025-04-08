import { Alert, Box } from '@mui/material';

function ErrorOverlay({ message }: { message: string }) {
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      height='100%'
    >
      <Alert severity='error'>{message}</Alert>
    </Box>
  );
}

export default ErrorOverlay;
