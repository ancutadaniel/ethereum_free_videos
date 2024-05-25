
import {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  ReactNode,
} from "react";
import {
  useConnectWallet,
  useNotifications,
  useWallets,
} from "@web3-onboard/react";
import { ethers } from "ethers";
import type { CustomNotification, Notification } from "@web3-onboard/core";
import type { TokenSymbol } from "@web3-onboard/common";
import onboard, { ethMainnetGasBlockPrices } from "../web3/onboard";
import { GasPrice } from "@web3-onboard/gas";
import FreeVideos from "../contracts/FreeVideos.json";
import config from "../contracts/config.json";

interface Account {
  address: string;
  balance: Record<TokenSymbol, string> | null;
  ens: { name: string | undefined; avatar: string | undefined };
}

interface WalletContextType {
  web3Onboard: typeof onboard | null;
  account: Account | null;
  notifications: Notification[];
  bnGasPrices: GasPrice[];
  provider: ethers.providers.Web3Provider | null;
  contract: ethers.Contract | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  handleNotification: (notification: CustomNotification) => void;
  signer: ethers.Signer | null;
}

interface Config {
  [key: string]: {
    address: string;
  };
}

const typedConfig: Config = config;

const MESSAGES = {
  networkNotSupported: `Please switch your network to either 'Localhost' or 'Sepolia' in your MetaMask to continue. The current network is not supported.`,
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

declare global {
  interface Window {
    ethereum: any;
  }
}

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const connectedWallets = useWallets();
  const [account, setAccount] = useState<Account | null>(null);
  const [{ wallet }, connect, disconnect] = useConnectWallet();
  const [notifications, customNotification] = useNotifications();
  const [web3Onboard, setWeb3Onboard] = useState<typeof onboard | null>(null);
  const [bnGasPrices, setBNGasPrices] = useState<GasPrice[]>([]);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    setWeb3Onboard(onboard);
    ethMainnetGasBlockPrices.subscribe((estimates) => {
      setBNGasPrices(estimates[0].blockPrices[0].estimatedPrices);
    });
    initializeProvider();
  }, []);

  useEffect(() => {
    if (wallet?.provider) {
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, "any");
      const { address } = wallet.accounts[0];
      updateAccountInfo(ethersProvider, address);
      setSigner(ethersProvider.getSigner());
    } else {
      setAccount(null);
      setSigner(null);
    }
  }, [wallet]);

  useEffect(() => {
    if (!connectedWallets.length) return;
    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    );
    console.log(connectedWalletsLabelArray);
  }, [connectedWallets, wallet]);

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  const updateAccountInfo = async (
    provider: ethers.providers.Web3Provider,
    address: string
  ) => {
    try {
      const balance = await fetchBalance(provider, address);
      if (wallet) {
        const { name, avatar } = wallet.accounts[0].ens ?? {};
        setAccount({
          address,
          balance: balance ? { ETH: balance } : null,
          ens: { name, avatar: avatar?.url },
        });
      }
    } catch (error) {
      console.error("Error updating account info:", error);
    }
  };

  const fetchBalance = async (
    provider: ethers.providers.Web3Provider,
    address: string
  ) => {
    try {
      const balance = await provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
  };

  const connectWallet = () => connect();

  const disconnectWallet = () => {
    if (wallet) {
      disconnect({ label: wallet.label });
      setAccount(null);
    }
  };

  const handleNotification = (notification: CustomNotification) => {
    customNotification(notification);
  };

  const initializeProvider = async () => {
    if (!window.ethereum) {
      console.error("No Ethereum provider found");
      return;
    }
    try {
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      await ethersProvider.send("eth_requestAccounts", []);
      const network = await ethersProvider.getNetwork();
      const networkIdAsString = String(network.chainId);

      if (!(networkIdAsString in typedConfig)) {
        alert(MESSAGES.networkNotSupported);
        return;
      }

      const freeVideosContract = new ethers.Contract(
        typedConfig[networkIdAsString].address,
        FreeVideos.abi,
        ethersProvider
      );

      setProvider(ethersProvider);
      setContract(freeVideosContract);
    } catch (error) {
      console.error("Error initializing provider:", error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        web3Onboard,
        account,
        notifications,
        bnGasPrices,
        provider,
        contract,
        connectWallet,
        disconnectWallet,
        handleNotification,
        signer,
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
