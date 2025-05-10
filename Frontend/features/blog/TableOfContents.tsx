"use client";

import {
  ActionIcon,
  Box,
  Burger,
  Drawer,
  TableOfContents as MantineTableOfContents,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";

export default function TableOfContents({ html }: { html: string }) {
  const [headings, setHeadings] = useState<
    { id: string; value: string; depth: number }[]
  >([]);
  const [opened, { open, close }] = useDisclosure(false);
  const reinitializeRef = useRef<() => void>(() => {});

  useEffect(() => {
    // Create a temporary div to parse the HTML content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Find all heading elements in the parsed content
    const headingElements = Array.from(tempDiv.querySelectorAll("h2, h3, h4"));

    const ensureHeadingIds = () => {
      extractedHeadings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (!element) {
          const matching = Array.from(
            document.querySelectorAll("h2, h3, h4")
          ).find(
            (el) =>
              el.textContent
                ?.toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-") === heading.id
          );
          if (matching && !matching.id) {
            matching.id = heading.id;
          }
        }
      });
    };

    const extractedHeadings = headingElements.map((heading) => {
      // Get the text content, handling nested tags
      const text = heading.textContent || "";
      const id = `heading-${text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")}`;

      // Set the ID on the heading element
      heading.id = id;

      return {
        id,
        value: text,
        depth: parseInt(heading.tagName.substring(1)) - 2,
      };
    });

    setHeadings(extractedHeadings);

    // Update the blog content container with the modified HTML
    const container = document.querySelector("[data-blog-content]");
    if (container) {
      container.innerHTML = tempDiv.innerHTML;
    }

    // Initial setup with timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      ensureHeadingIds();
      reinitializeRef.current(); // Initialize the scroll spy
    }, 200); // Increased timeout for better reliability

    return () => {
      clearTimeout(timer);
    };
  }, [html]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <ActionIcon
        variant="transparent"
        pos="fixed"
        bottom={16}
        right={16}
        radius="xl"
        size="lg"
        aria-label="Open table of contents"
        onClick={open}
        display={{ base: "block", md: "none" }}
        style={{
          zIndex: 500,
        }}
      >
        <Burger opened={false} size="sm" />
      </ActionIcon>

      {/* Mobile TOC */}
      <Drawer
        opened={opened}
        onClose={close}
        title="Nội dung"
        position="left"
        size="md"
        display={{ base: "block", md: "none" }}
        zIndex={1000}
      >
        <TOC
          initialData={headings}
          reinitializeRef={reinitializeRef}
          onClick={close}
        />
      </Drawer>

      {/* Desktop TOC */}
      <Box
        pos="sticky"
        top={90}
        w={280}
        display={{ base: "none", md: "block" }}
      >
        <Title order={6} mb="md">
          Nội dung
        </Title>
        <TOC initialData={headings} reinitializeRef={reinitializeRef} />
      </Box>
    </>
  );
}

const TOC = ({
  initialData,
  reinitializeRef,
  onClick,
}: {
  initialData: { id: string; value: string; depth: number }[];
  reinitializeRef: React.RefObject<() => void>;
  onClick?: () => void;
}) => {
  return (
    <MantineTableOfContents
      initialData={initialData}
      reinitializeRef={reinitializeRef}
      minDepthToOffset={0}
      depthOffset={25}
      size="sm"
      scrollSpyOptions={{
        selector: "h2, h3, h4",
        getDepth: (element) => parseInt(element.tagName.substring(1)) - 1,
        getValue: (element) => element.textContent || "",
      }}
      getControlProps={({ data }) => ({
        onClick: () => {
          data.getNode().scrollIntoView();
          onClick?.();
        },
        "aria-label": `Đến mục ${data.value}`,
        children: data.value,
      })}
    />
  );
};
