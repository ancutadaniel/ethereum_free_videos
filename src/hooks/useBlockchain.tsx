import { useEffect, useState } from "react";
import { ethers } from "ethers";

import FreeVideos from "../contracts/FreeVideos.json";
import config from "../contracts/config.json";

declare global {
  interface Window {
    ethereum: any;
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
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const networkIdAsString = String(network.chainId);

      if (!(networkIdAsString in typedConfig)) {
        alert(MESSAGES.networkNotSupported);
        return;
      }

      const youtube = new ethers.Contract(
        typedConfig[networkIdAsString].address,
        FreeVideos.abi,
        provider
      );

      setProvider(provider);
      setContract(youtube);
    };

    loadBlockchainData();
  }, []);

  return { provider, contract };
};

export default useBlockchain;
