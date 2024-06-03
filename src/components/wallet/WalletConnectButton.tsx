import { FC, useCallback } from "react";
import Button from "../UI/Button";
import { useWallet } from "../../contexts/WalletContext";
import * as blockies from "ethereum-blockies";
import { ethers } from "ethers";

const WalletConnectButton: FC = () => {
  const { balance, wallet, address, connect, disconnect, handleNotification } = useWallet();

  const handleCopyAddress = useCallback(() => {
    if (address) {
      navigator.clipboard.writeText(address);
      handleNotification({
        eventCode: "copySuccess",
        type: "success",
        message: "Address copied to clipboard!",
        autoDismiss: 2000,
      });
    }
  }, [address, handleNotification]);

  return (
    <div className="flex items-center space-x-4 flex-col md:flex-row">
      {wallet ? (
        <>
          {balance && (
            <div className="flex items-center space-x-2">
              <p className="text-blue-700 dark:text-white">
                Balance: {ethers.formatUnits(balance, "ether").slice(0, 6)} ETH
              </p>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <img
              src={blockies.create({ seed: address }).toDataURL()}
              alt="Identicon"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex items-center space-x-1">
              <span className="text-blue-700 dark:text-white cursor-pointer" onClick={handleCopyAddress}>
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </span>
            </div>
          </div>
          <Button
            onClick={() => disconnect(wallet)}
            className="bg-secondary-dark text-white mt-2 mr-2 ml-2 mb-2 md:mt-0 md:mr-0 md:ml-0 md:mb-0"
          >
            Disconnect
          </Button>
        </>
      ) : (
        <Button
          onClick={() => connect()}
          className="dark:bg-accent-btn text-white m-2 md:mx-0 md:my-0"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default WalletConnectButton;
