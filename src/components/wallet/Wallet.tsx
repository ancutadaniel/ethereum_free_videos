import { useEffect } from "react";
import { useWallet } from "../../contexts/WalletContext";

const Wallet = () => {
  const {
    account,
    notifications,
    connectWallet,
    disconnectWallet,
    handleNotification,
  } = useWallet();

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
          <button onClick={() => disconnectWallet()}>Disconnect</button>
          <button
            onClick={() =>
              handleNotification({
                type: "hint",
                message: "This is a custom hint notification!",
                autoDismiss: 2000,
              })
            }
          >
            Custom Notification
          </button>
        </>
      )}
      <button onClick={connectWallet}>Connect</button>
    </div>
  );
};

export default Wallet;
