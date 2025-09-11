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
        className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-amber-200/50 shadow-lg transition-all duration-300"
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
      className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-amber-200/50 dark:bg-neutral-800/90 dark:border-neutral-700/50 dark:hover:bg-neutral-700/90 dark:hover:border-amber-600/50 shadow-lg transition-all duration-300 group"
    >
      <Sun className="h-5 w-5 text-amber-500 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:scale-110" />
      <Moon className="absolute h-5 w-5 text-amber-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:scale-110" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}