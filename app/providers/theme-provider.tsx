import { ReactNode } from "@tanstack/react-router";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// import type { ThemeProviderProps } from "next-themes";
import { type Attribute } from "next-themes";

export function ThemeProvider({
  attribute,
  defaultTheme,
  enableColorScheme,
  enableSystem,
  children,
}: {
  children: ReactNode;
  attribute?: Attribute;
  defaultTheme?: "system" | "dark" | "light";
  enableSystem?: boolean;
  enableColorScheme?: boolean;
}) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableColorScheme={enableColorScheme}
      enableSystem={enableSystem}
    >
      {children}
    </NextThemesProvider>
  );
}
