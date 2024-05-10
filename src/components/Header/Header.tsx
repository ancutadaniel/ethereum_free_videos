import React from "react";
import { useConnectWallet } from "@web3-onboard/react";
import logo from "../../assets/logo.webp";
import Button from "../UI/Button";
import { useTheme } from "../../contexts/ThemeContext";

const Header: React.FC = () => {
  const [{ wallet }, connect, disconnect] = useConnectWallet();
  const { themeIcon, toggleTheme } = useTheme();

  const walletAddress = wallet?.accounts[0]?.address;

  return (
    <header className="bg-background-default dark:bg-background-dark shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <div className="hidden md:flex items-center space-x-4">
          {/* Updated Button for Toggle Theme */}
          <Button onClick={toggleTheme} className="bg-secondary-dark text-yellow-300 dark:text-yellow-300 dark:bg-transparent">
            {themeIcon}
          </Button>
          <Button onClick={() => connect()} className="dark:bg-accent-orange text-white">
            {walletAddress
              ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
              : "Connect Wallet"}
          </Button>
          {wallet && (
            <Button onClick={() => disconnect(wallet)} className="bg-secondary-dark text-white">
              Disconnect
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
