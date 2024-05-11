import React, { useState, FC } from "react";
import MenuButton from "../MenuButton/MenuButton";
import WalletConnectButton from "../Wallet/WalletConnectButton";
import logo from "../../assets/logo.webp";
import ThemeToggleButton from "../UI/ThemeToggleButton";

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-background-default dark:bg-background-dark shadow-md relative h-16">
      {" "}
      {/* Example fixed height */}
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
