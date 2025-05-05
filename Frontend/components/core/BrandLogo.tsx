import { Group, Title, TitleProps } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
} & TitleProps;

export const BrandLogo = ({ href, ...props }: BrandLogoProps) => {
  return href ? (
    <Link href={href}>
      <BaseLogo {...props} />
    </Link>
  ) : (
    <BaseLogo {...props} />
  );
}

export const BaseLogo = (props: TitleProps) => {
  return (
    <Group gap='sm' wrap="nowrap">
      <Image
        src="/favicon.svg"
        alt="Logo"
        width={32}
        height={32}
        style={{
          aspectRatio: 1 / 1,
          minWidth: 32,
        }}
      />
      <Title order={5} {...props}>
        AioTech
      </Title>
    </Group>
  );
};
