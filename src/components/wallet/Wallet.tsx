// Wallet.tsx
import { useEffect } from "react";
import { useWallet } from "../../contexts/WalletContext";
import Button from "../UI/Button";

const Wallet = () => {
  const { account, notifications, connectWallet, disconnectWallet } =
    useWallet();

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <div>
      {account && (
        <>
          {account.ens?.avatar && (
            <div>
              <p>{account.ens.avatar}</p>
            </div>
          )}
          <div>
            <p>{account.ens?.name || account.address}</p>
          </div>
          <Button onClick={() => disconnectWallet()}>Disconnect</Button>
          <Button onClick={() => console.log(notifications)}>
            Custom Notification
          </Button>
          <Button onClick={connectWallet}>Connect</Button>
        </>
      )}
    </div>
  );
};

export default Wallet;
