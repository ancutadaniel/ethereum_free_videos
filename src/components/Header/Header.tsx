import React, { useState, FC } from "react";
import MenuButton from "../MenuButton/MenuButton";
import WalletConnectButton from "../Wallet/WalletConnectButton";
import logo from "../../assets/logo.webp";
import ThemeToggleButton from "../UI/ThemeToggleButton";
import MenuItems from "../MenuItems/MenuItems";

interface HeaderProps {
  onSelect: (item: string) => void;
}

const Header: FC<HeaderProps> = ({ onSelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedAccordion, setSelectedAccordion] = useState<number | null>(
    null
  );

  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-background-default dark:bg-background-dark shadow-md relative h-16">
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
            <WalletConnectButton />
            <ThemeToggleButton />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } flex-col absolute top-full left-0 right-0 bg-background-dark shadow-md z-20 md:hidden`}
        >
          <WalletConnectButton />
          <MenuItems
            onSelect={onSelect}
            selectedAccordion={selectedAccordion}
            setSelectedAccordion={setSelectedAccordion}
            toggleMenu={toggleMenu}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
