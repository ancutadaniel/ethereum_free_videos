import  { useState, FC } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import logo from "../../assets/logo.webp";
import Button from "../UI/Button";
import { useTheme } from "../../contexts/ThemeContext";
import MenuButton from "../MenuButton/MenuButton";

const Header: FC = () => {
  const [{ wallet }, connect, disconnect] = useConnectWallet();
  const { themeIcon, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const walletAddress = wallet?.accounts[0]?.address;

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-background-default dark:bg-background-dark shadow-md relative">
      <div className="container mx-auto flex justify-between items-center p-4">
        <img src={logo} alt="Logo" className="h-10 w-auto" />

        {/* Right side container for both desktop and mobile */}
        <div className="flex items-center space-x-4">
          {/* Menu Button only on mobile */}
          <div className="flex md:hidden">
            <MenuButton toggleMenu={toggleMenu} className="mr-2" />
            <Button
              onClick={toggleTheme}
              className="bg-secondary-dark text-yellow-300 dark:text-yellow-300 dark:bg-transparent"
            >
              {themeIcon}
            </Button>
          </div>

          {/* large screens menu items */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={toggleTheme}
              className="bg-secondary-dark text-yellow-300 dark:text-yellow-300 dark:bg-transparent"
            >
              {themeIcon}
            </Button>
            <Button
              onClick={() => connect()}
              className="dark:bg-accent-orange text-white"
            >
              {walletAddress
                ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
                : "Connect Wallet"}
            </Button>
            {wallet && (
              <Button
                onClick={() => disconnect(wallet)}
                className="bg-secondary-dark text-white"
              >
                Disconnect
              </Button>
            )}
          </div>
        </div>

        {/* Small screens menu items */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } flex-col absolute top-full left-0 right-0 bg-background-default dark:bg-background-dark shadow-md z-20 md:hidden`}
        >
          <Button
            onClick={() => connect()}
            className="w-7/10 ml-auto mt-2 mr-4 text-center dark:bg-accent-orange text-white hover:bg-gray-200 dark:hover:bg-gray-700 mb-2"
          >
            {walletAddress
              ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
              : "Connect Wallet"}
          </Button>
          {wallet && (
            <Button
              onClick={() => disconnect(wallet)}
              className="w-7/10 ml-auto mb-2 mr-4 text-center bg-secondary-dark text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Disconnect
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
