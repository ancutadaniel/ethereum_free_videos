// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
    
    className="p-4 bg-background-default dark:bg-background-dark text-dark dark:text-white text-center flex-none">
      &copy; {new Date().getFullYear()}
    </footer>
  );
};

export default Footer;
