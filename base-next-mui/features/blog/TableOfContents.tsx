"use client";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function TableOfContents({ html }: { html: string }) {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const headingElements = Array.from(doc.querySelectorAll("h2, h3, h4"));

    const extractedHeadings = headingElements.map((heading) => {
      const text = heading.textContent || "";
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return {
        id,
        text,
        level: parseInt(heading.tagName.substring(1)),
      };
    });

    setHeadings(extractedHeadings);

    // Ensure headings have IDs in the actual DOM
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

    const handleScroll = () => {
      ensureHeadingIds(); // Ensure all headings have IDs before checking
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY + 130;
      let activeHeading = null;
      let minDistance = Infinity;

      for (const heading of extractedHeadings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const distance = Math.abs(elementTop - scrollPosition);

          if (rect.top <= viewportHeight / 2 && rect.bottom >= 0) {
            if (distance < minDistance) {
              minDistance = distance;
              activeHeading = heading.id;
            }
          }
        }
      }

      if (activeHeading && activeHeading !== activeId) {
        setActiveId(activeHeading);
      }
    };

    // Throttled scroll handler
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial setup with timeout to ensure DOM is ready
    const initialize = () => {
      ensureHeadingIds();
      handleScroll();
      window.addEventListener("scroll", scrollHandler, { passive: true });
      window.addEventListener("resize", scrollHandler);
    };

    const timer = setTimeout(initialize, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("resize", scrollHandler);
    };
  }, [html]);

  const scrollToHeading = (id: string) => {
    // First try finding the element directly
    let element = document.getElementById(id);

    // If not found, try finding by text content (fallback)
    if (!element) {
      const headings = Array.from(document.querySelectorAll("h2, h3, h4"));
      const matchingHeading = headings.find(
        (heading) =>
          heading.textContent
            ?.toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-") === id
      );
      if (matchingHeading) {
        // Create an ID if it doesn't exist
        if (!matchingHeading.id) {
          matchingHeading.id = id;
        }
        element = matchingHeading as HTMLElement;
      }
    }

    if (element) {
      const headerOffset = 130;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update the active ID immediately
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <IconButton
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
          display: { xs: "flex", md: "none" },
          bgcolor: "background.paper",
          boxShadow: 3,
          "&:hover": {
            bgcolor: "background.paper",
          },
        }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <MenuIcon />
      </IconButton>

      {/* Table of Contents */}
      <Box
        sx={{
          position: { xs: "fixed", md: "sticky" },
          top: { xs: 0, md: 130 },
          left: 0,
          width: { xs: "100%", md: 280 },
          height: { xs: "100vh", md: "auto" },
          bgcolor: "background.paper",
          zIndex: 1100,
          transform: {
            xs: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            md: "none",
          },
          transition: "transform 0.3s ease-in-out",
          boxShadow: { xs: 3, md: 0 },
          p: { xs: 2, md: 0 },
          overflowY: "auto",
        }}
      >
        {mobileOpen ? (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" gutterBottom>
              Nội dung
            </Typography>
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        ) : (
          <Typography variant="h6" gutterBottom>
            Nội dung
          </Typography>
        )}
        <List dense>
          {headings.map((heading) => (
            <ListItem key={heading.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  scrollToHeading(heading.id);
                  setMobileOpen(false);
                }}
                selected={activeId === heading.id}
                sx={{
                  pl: heading.level * 1.5,
                  "&.Mui-selected": {
                    color: "primary.main",
                    bgcolor: "transparent",
                  },
                }}
              >
                <Typography variant="body2">{heading.text}</Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}
