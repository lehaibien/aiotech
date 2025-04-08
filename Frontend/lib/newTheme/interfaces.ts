import { tertiary } from "./colors";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    tertiary?: typeof tertiary;
  }
  interface Palette {
    tertiary?: typeof tertiary;
  }
  interface TypeBackground {
    gradient?: string;
  }
}
