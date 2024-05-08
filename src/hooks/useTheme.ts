import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';  // Define Theme type

const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Retrieve the stored theme or default to 'dark'
        const storedTheme = localStorage.getItem('theme');
        return (storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark') as Theme;
    });

    // Effect to apply theme and save to localStorage
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.className = theme;
        localStorage.setItem('theme', theme);  
    }, [theme]);

    // Determine the theme icon
    const themeIcon = theme === 'light' ? '🌞' : '🌛';

    // Function to toggle theme
    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme, themeIcon }; 
};

export default useTheme;
