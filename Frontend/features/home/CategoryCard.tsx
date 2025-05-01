"use client";

import { IMAGE_ASPECT_RATIO } from "@/constant/imageAspectRatio";
import { Card, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  name: string;
  imageUrl: string;
};

export function CategoryCard({ name, imageUrl }: CategoryCardProps) {
  return (
    <Card
      component={Link}
      href={`products/?category=${name}`}
      padding="sm"
      h={150}
      radius="md"
      withBorder
    >
      <Card.Section>
        <Image
          src={imageUrl}
          width={600}
          height={400}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            aspectRatio: IMAGE_ASPECT_RATIO.BRANDING,
            padding: 4,
          }}
          priority
        />
      </Card.Section>
      <Title
        order={4}
        size="sm"
        c="dark"
        style={{
          textAlign: "center",
        }}
      >
        {name}
      </Title>
    </Card>
  );
}
