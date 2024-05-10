import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  textOnly?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  textOnly = false,
  className = "",
  type = "button",
  ...props
}) => {
  const { theme } = useTheme();

  // Basic styles for all buttons
  const baseStyle =
    "px-4 py-2 rounded-lg shadow-lg transition-all duration-300";
  // Conditional theme-based styles, adjusted based on the context
  const themeStyle =
    theme === "light"
      ? "bg-red-500 text-white hover:bg-blue-400 focus:ring-blue-300"
      : "bg-green-800 text-yellow-300 hover:bg-gray-700 focus:ring-gray-500";

  // Text-only button minimal styling
  const textOnlyStyle = textOnly ? "bg-transparent shadow-none" : themeStyle;

  // Combining all class names
  const cssClasses = `${baseStyle} ${textOnlyStyle} ${className}`;

  return (
    <button type={type} className={cssClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
