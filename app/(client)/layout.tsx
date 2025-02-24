"use client";

import { useTheme } from "next-themes";
import React, { useEffect } from "react";
type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    const themeColor = currentTheme === "dark" ? "#030712" : "#ffffff"; // Update these colors as needed
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
  }, [theme, systemTheme]);

  return <div>{children}</div>;
};

export default Layout;
