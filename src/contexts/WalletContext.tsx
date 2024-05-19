import {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  ReactNode,
} from "react";
import { useConnectWallet, useNotifications } from "@web3-onboard/react";
import type { CustomNotification, Notification } from "@web3-onboard/core";
import type { TokenSymbol } from "@web3-onboard/common";

interface Account {
  address: string;
  balance: Record<TokenSymbol, string> | null;
  ens: { name: string | undefined; avatar: string | undefined };
}

interface WalletContextType {
  account: Account | null;
  notifications: Notification[]; // Define a more specific type if possible
  connectWallet: () => void;
  disconnectWallet: () => void;
  handleNotification: (notification: CustomNotification) => void; // Expect a notification object
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [{ wallet }, connect, disconnect] = useConnectWallet();
  const [notifications, showNotification] = useNotifications();

  useEffect(() => {
    if (wallet?.provider) {
      const { name, avatar } = wallet?.accounts[0].ens ?? {};
      setAccount({
        address: wallet.accounts[0].address,
        balance: wallet.accounts[0].balance,
        ens: { name, avatar: avatar?.url },
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
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
