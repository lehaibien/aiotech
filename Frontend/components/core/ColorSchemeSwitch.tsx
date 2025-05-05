"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Moon, Sun } from "lucide-react";

export const ColorSchemeSwitch = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const toggleMode = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };
  return (
    <>
      <ActionIcon
        onClick={toggleMode}
        variant="transparent"
        color="var(--mantine-color-text)"
        aria-label="Change theme"
        lightHidden
      >
        <Sun />
      </ActionIcon>
      <ActionIcon
        onClick={toggleMode}
        variant="transparent"
        color="var(--mantine-color-text)"
        aria-label="Change theme"
        darkHidden
      >
        <Moon />
      </ActionIcon>
    </>
  );
};
