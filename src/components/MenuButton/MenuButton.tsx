import { FC } from "react";

interface MenuButtonProps {
  toggleMenu: () => void;
  className?: string;  // Optional className prop
}

const MenuButton: FC<MenuButtonProps> = ({ toggleMenu, className }) => (
  <button onClick={toggleMenu} className={`md:hidden block z-30 dark:text-white text-text-light ${className}`}>
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  </button>
);

export default MenuButton;
