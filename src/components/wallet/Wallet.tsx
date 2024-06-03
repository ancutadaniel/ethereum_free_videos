import { useWallet } from "../../contexts/WalletContext";
import Button from "../UI/Button";

const Wallet = () => {
  const { address, wallet, connecting, connect, disconnect } = useWallet();

  return (
    <div>
      {address && wallet && (
        <>
          <div>
            <p>{address}</p>
          </div>
          <Button disabled={connecting} onClick={() => disconnect(wallet)}>
            Disconnect
          </Button>
          <Button disabled={connecting} onClick={connect}>
            Connect
          </Button>
        </>
      )}
    </div>
  );
};

export default Wallet;
