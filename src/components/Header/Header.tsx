import React, { useState, FC } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import Button from "../UI/Button";
import MenuButton from "../MenuButton/MenuButton";
import WalletConnectButton from "../Wallet/WalletConnectButton";
import logo from "../../assets/logo.webp";

const Header: FC = () => {
  const { themeIcon, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);

  // Subcomponent for the theme toggle button to avoid repetition
  const ThemeToggleButton = () => (
    <Button
      onClick={toggleTheme}
      className="bg-secondary-dark text-yellow-300 dark:text-yellow-300 dark:bg-transparent"
    >
      {themeIcon}
    </Button>
  );

  return (
    <header className="bg-background-default dark:bg-background-dark shadow-md relative">
      <div className="container mx-auto flex justify-between items-center p-4">
        <img src={logo} alt="Logo" className="h-10 w-auto" />

        {/* Desktop and Mobile Navigation */}
        <div className="flex items-center space-x-4">
          {/* Mobile specific elements */}
          <div className="md:hidden flex items-center space-x-2">
            <MenuButton toggleMenu={toggleMenu} />
            <ThemeToggleButton />
          </div>

          {/* Desktop specific elements */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggleButton />
            <WalletConnectButton />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } flex-col absolute top-full left-0 right-0 bg-background-default dark:bg-background-dark shadow-md z-20 md:hidden`}
        >
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
