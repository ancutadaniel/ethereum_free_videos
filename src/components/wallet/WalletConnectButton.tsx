// WalletConnectButton.tsx
import { FC, useState, useEffect } from 'react';
import Button from '../UI/Button';
import { useWallet } from '../../contexts/WalletContext';
import * as blockies from 'ethereum-blockies';

const WalletConnectButton: FC = () => {
  const { account, connectWallet, disconnectWallet } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (account && account.balance) {
      setBalance(account.balance['ETH']);
    } else {
      setBalance(null);
    }
  }, [account]);

  return (
    <>
      {account && balance && (
        <div className="flex items-center space-x-2">
          <img
            src={blockies.create({ seed: account.address }).toDataURL()}
            alt="Identicon"
            className="w-10 h-10 rounded-full"
          />
          <p className="text-blue-700 dark:text-white">
            Balance: {Number(balance).toFixed(4)} ETH
          </p>
        </div>
      )}
      <Button
        onClick={() => (account ? disconnectWallet() : connectWallet())}
        className="dark:bg-accent-btn text-white m-2 md:mx-0 md:my-0"
      >
        {account
          ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
          : 'Connect Wallet'}
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
