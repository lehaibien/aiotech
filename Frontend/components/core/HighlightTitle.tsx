import { Title, TitleProps } from "@mantine/core";

type HighlightTitleProps = {
  children: React.ReactNode;
} & TitleProps;

export function HighlightTitle({ children, ...props }: HighlightTitleProps) {
  return (
    <Title
      {...props}
      style={{
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -8,
          left: 0,
          width: 60,
          height: 4,
          backgroundColor: "var(--mantine-color-blue-4)",
          borderRadius: 2,
        },
      }}
    >
      {children}
    </Title>
  );
}
