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
    <header className="bg-white dark:bg-slate-700 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <div className="hidden md:flex items-center space-x-4">
          <Button onClick={toggleTheme}>{themeIcon}</Button>
          <Button onClick={() => connect()} className="bg-green-500 text-white">
            {walletAddress
              ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
              : "Connect Wallet"}
          </Button>
          {wallet && (
            <Button
              onClick={() => disconnect(wallet)}
              className="bg-red-500 text-white"
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
