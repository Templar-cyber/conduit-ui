"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
      document.documentElement.className = saved;
    }
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.className = next;
  };

  return (
    <button
      onClick={toggle}
      className="
w-full flex items-center justify-between
px-3 py-2 rounded-lg
text-sm font-medium
bg-gray-100 text-gray-900
dark:bg-gray-800 dark:text-white
hover:bg-gray-200 dark:hover:bg-gray-700
transition
"
    >
      <span>{theme === "light" ? "Light" : "Dark"}</span>
      <span>{theme === "light" ? "☀️" : "🌙"}</span>
    </button>
  );
}
