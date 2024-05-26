// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-gray-800 text-white text-center flex-none">
      &copy; {new Date().getFullYear()}
    </footer>
  );
};

export default Footer;
