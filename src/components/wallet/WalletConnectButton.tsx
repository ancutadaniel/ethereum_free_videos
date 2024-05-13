import { FC } from "react";
import Button from "../UI/Button";
import { useWallet } from "../../contexts/WalletContext";

const WalletConnectButton: FC = () => {
  const { account, connectWallet, disconnectWallet } = useWallet();

  return (
    <>
      {account && account.balance && (
        <div className="flex flex-col items-center">
          <p className="text-white">Balance: {account.balance["ETH"]} ETH</p>
        </div>
      )}
      <Button
        onClick={() => (account ? disconnectWallet() : connectWallet())}
        className="dark:bg-accent-btn text-white m-2 md:mx-0 md:my-0"
        disabled={!!account}
      >
        {account
          ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
          : "Connect Wallet"}
      </Button>
      {account && (
        <Button
          onClick={disconnectWallet}
          className="bg-secondary-dark text-white mt-2 mr-2 ml-2 mb-2 md:mt-0 md:mr-0 md:ml-0 md:mb-0"
        >
          Disconnect
        </Button>
      )}
    </>
  );
};

export default WalletConnectButton;
