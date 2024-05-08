import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    textOnly?: boolean; 
    className?: string; 
    theme?: string;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ children, theme, type = 'button', className = '', ...props }) => {
    // Determine button style based on the theme
    const buttonStyle = theme === 'light'
        ? "bg-blue-500 text-white hover:bg-blue-400"
        : "bg-gray-800 text-yellow-300 hover:bg-gray-700";

    let cssClasses = type;
   cssClasses += ` ${className} ${buttonStyle} pb-1 pt-1 pl-2 pr-2 rounded-lg shadow-lg transition-all duration-300`;

    // Additional classes for positioning the button in the top right
    const positioning = "absolute top-4 right-4";

    return (
        <button className={`${cssClasses} ${positioning}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
