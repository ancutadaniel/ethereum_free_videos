import { useEffect, useState } from "react";
// import useConnect from "../../hooks/useConnect";
import { useConnectWallet, useNotifications } from "@web3-onboard/react";
import type { TokenSymbol } from "@web3-onboard/common";
import { WalletState } from "@web3-onboard/core";

interface Account {
  address: string;
  balance: Record<TokenSymbol, string> | null;
  ens: { name: string | undefined; avatar: string | undefined };
}

const Wallet = () => {
  const [account, setAccount] = useState<Account | null>(null);
  const [notifications, customNotification] = useNotifications();
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  useEffect(() => {
    if (wallet?.provider) {
      const { name, avatar } = wallet?.accounts[0].ens ?? {};
      setAccount({
        address: wallet.accounts[0].address,
        balance: wallet.accounts[0].balance,
        ens: { name, avatar: avatar?.url },
      });
    }
  }, [wallet]);

  const handleConnect = () => connect();
  const handleDisconnect = (wallet: WalletState) => disconnect(wallet);

  const handleNotify = () => {
    customNotification({
      type: "hint",
      message: "This is a custom hint notification!",
      autoDismiss: 2000,
    });
  };

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <div>
      {wallet?.provider && account ? (
        <>
          {account.ens?.avatar ? (
            <div>
              <p>{account.ens?.avatar}</p>
            </div>
          ) : null}
          <div>
            <p>{account.ens?.name ? account.ens.name : account.address}</p>
          </div>
          <div>
            <p>Connected to {wallet.label}</p>
          </div>
          <div>
            <button onClick={() => handleDisconnect(wallet)}>Disconnect</button>
          </div>
          <div>
            <button onClick={handleNotify}>Custom Notification</button>
          </div>
        </>
      ) : (
        <div>
          <button disabled={connecting} onClick={handleConnect}>
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default Wallet;
