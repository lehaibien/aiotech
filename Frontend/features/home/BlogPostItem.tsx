"use client";

import { IMAGE_ASPECT_RATIO } from "@/constant/image";
import dayjs from "@/lib/extended-dayjs";
import { Card, Group, Text } from "@mantine/core";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type BlogPostItemProps = {
  title: string;
  slug: string;
  imageUrl: string;
  createdDate: Date;
  imgHeight?: number;
};

export default function BlogPostItem({
  title,
  slug,
  imageUrl,
  createdDate,
  imgHeight = 200,
}: BlogPostItemProps) {
  const postDate = dayjs(createdDate);
  const formattedDate = postDate.format("DD/MM/YYYY");
  return (
    <Card padding='lg' component={Link} href={`/blogs/${slug}`}>
      <Card.Section h={imgHeight}>
        <Image
          src={imageUrl}
          alt={title}
          height={800}
          width={1200}
          priority
          style={{
            objectFit: "fill",
            width: "100%",
            height: "100%",
            aspectRatio: IMAGE_ASPECT_RATIO.BLOG,
          }}
        />
      </Card.Section>
      <Text size="xl" component="h4">
        {title}
      </Text>
      <Group gap={4}>
        <Calendar fontSize="small" />
        <Text size="sm">{formattedDate}</Text>
      </Group>
    </Card>
  );
}
