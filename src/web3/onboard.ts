import Onboard from "@web3-onboard/core";

import wallets from "./modules/index";
import chains from "./chains/chains";

import assets from "../assets/index";

const appMetadata = {
  name: "Web3 Wallet Connected",
  logo: assets.logo,
  description: "You are now connected to Free Videos Blockchain App",
  recommendedInjectedWallets: [
    { name: "MetaMask", url: "https://metamask.io" },
  ],
};

const onboard = Onboard({
  wallets,
  chains,
  appMetadata,
  apiKey: process.env.REACT_APP_ONBOARD_API_KEY,
  theme: "dark",
  connect: {    
    showSidebar: true,
    removeWhereIsMyWalletWarning: true,    
    iDontHaveAWalletLink: "https://metamask.io",
  },
  accountCenter: {
    desktop: {
      enabled: true,
      position: "bottomRight",
    },
    mobile: {
      enabled: true,
      position: "bottomRight",
    },
  }
});

export default onboard;