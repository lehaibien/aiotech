import { Box } from '@mui/material';

export type HtmlContentProps = {
  content: string;
};

export const HtmlContent = ({ content }: HtmlContentProps) => {
  return (
    <Box
      component='article'
      sx={{
        typography: 'body1',
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: 1,
          my: 2,
        },
        '& figure': { m: 0, my: 3 },
        '& figcaption': {
          textAlign: 'center',
          fontStyle: 'italic',
          mt: 1,
          color: 'text.secondary',
        },
        '& h1': {
          mt: 4,
          mb: 2,
          fontWeight: 600,
          fontSize: '2.5rem',
        },
        '& h2': {
          mt: 3,
          mb: 2,
          fontWeight: 600,
          fontSize: '2rem',
        },
        '& h3': {
          mt: 2,
          mb: 2,
          fontWeight: 600,
          fontSize: '1.75rem',
        },
        '& h4': {
          mt: 2,
          mb: 2,
          fontWeight: 600,
          fontSize: '1.5rem',
        },
        '& h5': {
          mt: 2,
          mb: 2,
          fontWeight: 600,
          fontSize: '1.25rem',
        },
        '& h6': {
          mt: 2,
          mb: 2,
          fontWeight: 600,
          fontSize: '1.1rem',
        },
        '& strong': { fontWeight: 600 },
        '& p': { mb: 2, lineHeight: 1.5 },
        '& a': {
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        },
        '& blockquote': {
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          pl: 2,
          py: 1,
          my: 3,
          mx: 0,
          fontStyle: 'italic',
          bgcolor: 'action.hover',
          borderRadius: '0 4px 4px 0',
        },
        '& ul, & ol': {
          pl: 3,
          mb: 2,
          listStyleType: 'disc',
          '& li': { mb: 1 },
        },
        '& li': { mb: 1 },
        '& pre': {
          p: 2,
          borderRadius: 1,
          bgcolor: 'grey.900',
          color: 'common.white',
          overflow: 'auto',
          fontSize: '0.875rem',
        },
        '& code': {
          fontFamily: 'monospace',
          bgcolor: 'action.hover',
          p: 0.5,
          borderRadius: 0.5,
          fontSize: '0.875em',
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          mt: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'grey.300',
        },
        '& th, & td': {
          border: '1px solid',
          borderColor: 'grey.300',
          padding: 1,
          textAlign: 'left',
        },
        '& th p, & td p': {
          margin: 0,
        },
        '& th': {
          fontWeight: 600,
          bgcolor: 'grey.100',
        },
        '& hr': {
          border: 'none',
          borderTop: '1px solid',
          borderColor: 'grey.300',
          mt: 3,
          mb: 3,
        },
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
