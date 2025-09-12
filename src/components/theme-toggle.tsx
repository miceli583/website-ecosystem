"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full border border-gray-200/50 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-amber-200/50 hover:bg-white/90"
      >
        <div className="h-5 w-5" />
      </Button>
    );
  }

  const handleToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="group h-10 w-10 rounded-full border border-gray-200/50 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-amber-200/50 hover:bg-white/90 dark:border-neutral-700/50 dark:bg-neutral-800/90 dark:hover:border-amber-600/50 dark:hover:bg-neutral-700/90"
    >
      <Sun className="h-5 w-5 scale-100 rotate-0 text-amber-500 transition-all group-hover:scale-110 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-5 w-5 scale-0 rotate-90 text-amber-400 transition-all group-hover:scale-110 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
