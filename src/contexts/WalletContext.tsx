import {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  ReactNode,
} from 'react';
import { useConnectWallet, useNotifications } from '@web3-onboard/react';
import { ethers } from 'ethers';
import type { CustomNotification, Notification } from '@web3-onboard/core';
import type { TokenSymbol } from '@web3-onboard/common';

interface Account {
  address: string;
  balance: Record<TokenSymbol, string> | null;
  ens: { name: string | undefined; avatar: string | undefined };
}

interface WalletContextType {
  account: Account | null;
  notifications: Notification[];
  connectWallet: () => void;
  disconnectWallet: () => void;
  handleNotification: (notification: CustomNotification) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [{ wallet }, connect, disconnect] = useConnectWallet();
  const [notifications, showNotification] = useNotifications();

  useEffect(() => {
    const fetchBalance = async (provider: ethers.providers.Web3Provider, address: string) => {
      try {
        const balance = await provider.getBalance(address);
        return ethers.utils.formatEther(balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        return null;
      }
    };

    if (wallet?.provider) {
      const provider = new ethers.providers.Web3Provider(wallet.provider, 'any');
      const { address } = wallet.accounts[0];
      fetchBalance(provider, address).then((balance) => {
        const { name, avatar } = wallet.accounts[0].ens ?? {};
        setAccount({
          address,
          balance: balance ? { ETH: balance } : null,
          ens: { name, avatar: avatar?.url },
        });
      });
    } else {
      setAccount(null);
    }
  }, [wallet]);

  const connectWallet = () => connect();

  const disconnectWallet = () => {
    if (wallet) {
      disconnect({ label: wallet.label });
      setAccount(null);
    }
  };

  const handleNotification = (notification: CustomNotification) => {
    showNotification(notification);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        notifications,
        connectWallet,
        disconnectWallet,
        handleNotification,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
