// WalletConnectButton.tsx
import { FC } from "react";
import Button from "../UI/Button";
import { useConnectWallet } from "@web3-onboard/react";

const WalletConnectButton: FC = () => {
  const [{ wallet }, connect, disconnect] = useConnectWallet();
  const walletAddress = wallet?.accounts[0]?.address || null;

  const handleButtonClick = () => {
    if (!walletAddress) {
      connect();
    }
  };

  return (
    <>
      <Button
        onClick={handleButtonClick}
        className="dark:bg-accent-btn text-white m-2 md:mx-0 md:my-0"
        disabled={!!walletAddress}
      >
        {walletAddress
          ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
          : "Connect Wallet"}
      </Button>
      {wallet && (
        <Button
          onClick={() => disconnect(wallet)}
          className="bg-secondary-dark text-white mt-2 mr-2 ml-2 mb-2 md:mt-0 md:mr-0 md:ml-0 md:mb-0" 
        >
          Disconnect
        </Button>
      )}
    </>
  );
};

export default WalletConnectButton;
