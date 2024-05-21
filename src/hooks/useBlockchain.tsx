import { useEffect, useState } from "react";
import { ethers } from "ethers";

import FreeVideos from "../contracts/FreeVideos.json";
import config from "../contracts/config.json";

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
  }
}

// Define the Config interface with an index signature
interface Config {
  [key: string]: {
    address: string;
  };
}

// Explicitly type the config import
const typedConfig: Config = config;

const MESSAGES = {
  networkNotSupported: `Please switch your network to either 'Localhost' or 'Sepolia' in your MetaMask to continue. The current network is not supported.`,
};

const useBlockchain = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadBlockchainData = async () => {
    if (!window.ethereum) {
      console.error("No Ethereum provider found");
      return;
    }

    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const networkIdAsString = String(network.chainId);

      if (!(networkIdAsString in typedConfig)) {
        alert(MESSAGES.networkNotSupported);
        return;
      }

      const freeVideos = new ethers.Contract(
        typedConfig[networkIdAsString].address,
        FreeVideos.abi,
        provider.getSigner()
      );

      setProvider(provider);
      setContract(freeVideos);
      setIsInitialized(true);
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return { provider, contract, isInitialized };
};

export default useBlockchain;
