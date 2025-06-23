import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AdvancedThemeToggle() {
  const { setTheme, theme } = useTheme();

  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "system", icon: Monitor, label: "System" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  const currentIndex = themes.findIndex((t) => t.value === theme);

  return (
    <div className="flex items-center justify-between py-2 px-3 w-full">
      {/* <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Theme</span>
      </div> */}
      <div className="relative flex items-center bg-muted justify-between rounded-full p-1 w-full h-8">
        {/* Sliding Background */}
        <div
          className={cn(
            "absolute top-1 left-1 h-6 w-6 bg-primary rounded-full transition-all duration-300 ease-in-out shadow-sm",
            currentIndex === 0 && "translate-x-0",
            currentIndex === 1 && "translate-x-17",
            currentIndex === 2 && "translate-x-33.5"
          )}
        />

        {/* Theme Options */}
        {themes.map((themeOption, index) => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.value;

          return (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={cn(
                "relative z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ease-in-out",
                "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"
              )}
              aria-label={`Switch to ${themeOption.label} theme`}
            >
              <Icon
                className={cn(
                  "h-3 w-3 transition-all duration-300 ease-in-out",
                  isActive
                    ? "text-primary-foreground scale-100"
                    : "text-muted-foreground scale-90"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
