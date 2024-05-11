import Onboard from "@web3-onboard/core";
import transactionPreviewModule from "@web3-onboard/transaction-preview";

import wallets from "./modules/index";
import chains from "./chains/chains";

import assets from "../assets/index";

const appMetadata = {
  name: "Web3 Wallet Connected",
  icon: assets.logo,
  logo: assets.logo,
  description: "Your are now connected to Free Videos Blockchain App",
  recommendedInjectedWallets: [
    { name: "MetaMask", url: "https://metamask.io" },
  ],
};

const transactionPreview = transactionPreviewModule({
  requireTransactionApproval: false,
});

const onboard = Onboard({
  wallets,
  chains,
  appMetadata: appMetadata,
  transactionPreview,
  apiKey: process.env.REACT_APP_ONBOARD_API_KEY,
  theme: "dark",
  connect: {
    autoConnectLastWallet: true,
    showSidebar: true,
    removeWhereIsMyWalletWarning: true,
    removeIDontHaveAWalletInfoLink: false,
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
  },
});

export default onboard;
