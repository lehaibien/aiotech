'use client';

import { DashboardMenuContext } from "@/contexts/DashboardMenuProvider";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { useContext } from "react";

export function MenuButton() {
    const [open, setOpen] = useContext(DashboardMenuContext);
    function toggleMenu() {
      const isOpen = !open;
      setOpen(isOpen);
    }
    return (
        <IconButton onClick={toggleMenu} aria-label="Open menu">
        <MenuIcon />
      </IconButton>
    )
}