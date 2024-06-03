import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { useConnectWallet, useNotifications } from "@web3-onboard/react";
import {
  BigNumberish,
  BrowserProvider,
  Contract,
  JsonRpcSigner,
  ethers,
} from "ethers";
import type { CustomNotification, WalletState } from "@web3-onboard/core";
import FreeVideos from "../contracts/FreeVideos.json";
import config from "../contracts/config.json";

type WalletContextType = {
  provider: BrowserProvider | undefined;
  wallet: WalletState | null;
  connecting: boolean;
  contract: ethers.Contract | null;
  address: string;
  nonce: number;
  gasPrice: BigNumberish | null;
  signer: JsonRpcSigner | undefined;
  balance: BigNumberish | undefined;
  connect: () => Promise<WalletState[]>;
  disconnect: (wallet: WalletState) => Promise<WalletState[]>;
  handleNotification: (notification: CustomNotification) => void;
};

interface Config {
  [key: string]: {
    address: string;
  };
}

const typedConfig: Config = config;

const MESSAGES = {
  networkNotSupported: `Please switch your network to either 'Localhost' or 'Sepolia' in your MetaMask to continue. The current network is not supported.`,
};

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [, customNotification] = useNotifications();
  const [provider, setProvider] = useState<BrowserProvider>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [address, setAddress] = useState<string>("");
  const [nonce, setNonce] = useState<number>(0);
  const [gasPrice, setGasPrice] = useState<BigNumberish | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>();
  const [balance, setBalance] = useState<bigint>();

  const handleNotification = useCallback(
    (notification: CustomNotification) => {
      customNotification(notification);
    },
    [customNotification]
  );

  const init = useCallback(async () => {
    if (!wallet) return;

    try {
      const ethersProvider = new ethers.BrowserProvider(wallet.provider, "any");
      const signerInstance = await ethersProvider.getSigner();
      const gasPrice = (await ethersProvider.getFeeData()).gasPrice;
      const network = await ethersProvider.getNetwork();
      const contractAddress =
        config[network.chainId.toString() as keyof typeof config].address;
      const nonce = await signerInstance.getNonce();
      const balance = await ethersProvider.getBalance(signerInstance.address);

      const networkIdAsString = String(network.chainId);

      if (!(networkIdAsString in typedConfig)) {
        alert(MESSAGES.networkNotSupported);
        return;
      }

      const freeVideosContract = new ethers.Contract(
        contractAddress,
        FreeVideos.abi,
        ethersProvider
      );

      setProvider(ethersProvider);
      setNonce(nonce);
      setAddress(signerInstance.address);
      setContract(freeVideosContract);
      setGasPrice(gasPrice);
      setSigner(signerInstance);
      setBalance(balance);
    } catch (error) {
      handleNotification({
        eventCode: "error",
        type: "error",
        message: "Error initializing contract",
        autoDismiss: 5000,
      });
    }
  }, [wallet, handleNotification]);

  useEffect(() => {
    init();
  }, [wallet, init]);

  const value = useMemo(
    () => ({
      provider,
      wallet,
      connecting,
      contract,
      address,
      nonce,
      gasPrice,
      signer,
      balance,
      connect,
      disconnect,
      handleNotification,
    }),
    [
      provider,
      wallet,
      connecting,
      contract,
      address,
      nonce,
      gasPrice,
      signer,
      balance,
      connect,
      disconnect,
      handleNotification,
    ]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === null) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
