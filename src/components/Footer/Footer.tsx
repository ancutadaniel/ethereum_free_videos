import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-background-default dark:bg-background-dark text-dark dark:text-white text-center flex-none">
      &copy; {new Date().getFullYear()} | 
      <a href="https://github.com/ancutadaniel/ethereum_free_videos" target="_blank" rel="noopener noreferrer" className="text-dark dark:text-white ml-2">
        Daniel Ancuta
      </a>
    </footer>
  );
};

export default Footer;
