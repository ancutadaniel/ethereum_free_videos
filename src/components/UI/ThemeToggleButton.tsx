import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import Button from "./Button"; // Assuming Button is the UI component you use

const ThemeToggleButton: React.FC = () => {
  const { themeIcon, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      className="bg-secondary-dark text-yellow-300 dark:text-yellow-300 dark:bg-transparent rounded-full p-2"
    >
      {themeIcon}
    </Button>
  );
};

export default ThemeToggleButton;
