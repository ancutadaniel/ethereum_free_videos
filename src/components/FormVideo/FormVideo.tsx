import {
  useState,
  FC,
  ChangeEvent,
  FormEvent,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Button from "../UI/Button";
import { BigNumberish, EventLog } from "ethers";
import useHelia from "../../hooks/useHelia";
import { useWallet } from "../../contexts/WalletContext";

interface FormData {
  title: string;
  selectedFile: string;
  bufferFile: Uint8Array | null;
}

const FormVideo: FC<{
  onVideoAdded: (video: {
    id: BigNumberish;
    title: string;
    hash: string;
    author: string;
  }) => void;
}> = ({ onVideoAdded }) => {
  const { provider, contract, nonce, signer, handleNotification } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    selectedFile: "No file selected",
    bufferFile: null,
  });

  const latestBlockNumberRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchLatestBlockNumber = async () => {
      if (provider) {
        const blockNumber = await provider.getBlockNumber();
        latestBlockNumberRef.current = blockNumber;
      }
    };

    fetchLatestBlockNumber();
  }, [provider]);

  const handleVideoAdded = useCallback(
    (
      id: BigNumberish,
      hash: string,
      title: string,
      author: string,
      event: EventLog
    ) => {
      if (
        !latestBlockNumberRef.current ||
        event.blockNumber <= latestBlockNumberRef.current
      ) {
        return; // Ignore events from before this component was mounted
      }

      onVideoAdded({ id, title, hash, author });
      setLoading(false);

      handleNotification({
        eventCode: "transactionSuccess",
        type: "success",
        message: "Transaction was successfully minted...",
        autoDismiss: 5000,
      });
    },
    [handleNotification, onVideoAdded]
  );

  useEffect(() => {
    if (!contract) return;

    contract.on("VideoAdded", handleVideoAdded);

    return () => {
      contract.off("VideoAdded", handleVideoAdded);
    };
  }, [contract, handleVideoAdded]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "title") {
      setFormData((prev) => ({ ...prev, title: value }));
    } else if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          bufferFile: new Uint8Array(reader.result as ArrayBuffer),
          selectedFile: file.name,
        }));
      };
      reader.onerror = () =>
        handleNotification({
          eventCode: "error",
          type: "error",
          message: "Error uploading file",
          autoDismiss: 5000,
        });
      reader.readAsArrayBuffer(file);
    }
  };

  const handleTransaction = useCallback(
    async (cid: string) => {
      if (!provider || !contract || !signer)
        throw new Error(
          "Blockchain provider, contract, or signer not available."
        );

      const transaction = {
        to: contract.target,
        data: contract.interface.encodeFunctionData("uploadVideo", [
          cid,
          formData.title,
        ]),
        nonce,
        value: 0,
      };

      try {
        const txResponse = await signer.sendTransaction(transaction);
        

        handleNotification({
          eventCode: "transactionPending",
          type: "pending",
          message: "Transaction is pending confirmation...",
          autoDismiss: 5000,
        });
        await txResponse.wait();

        console.log(txResponse);
        
        handleNotification({
          eventCode: "transactionSent",
          type: "success",
          message: "Transaction sent successfully!",
          autoDismiss: 5000,
        });
      } catch (error) {
        handleNotification({
          eventCode: "transactionError",
          type: "error",
          message: `MetaMask Tx Signature: User denied transaction signature.`,
          autoDismiss: 5000,
        });
        setLoading(false);
      }
    },
    [provider, contract, signer, formData.title, handleNotification]
  );

  const { handleFileUpload } = useHelia(async (cid: string) => {
    await handleTransaction(cid);
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.bufferFile) {
      handleNotification({
        eventCode: "error",
        type: "error",
        message: "No file buffer available.",
        autoDismiss: 5000,
      });
      return;
    }

    setLoading(true);
    try {
      await handleFileUpload(formData.bufferFile);
    } catch (error) {
      handleNotification({
        eventCode: "error",
        type: "error",
        message: `Error adding video`,
        autoDismiss: 5000,
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <label htmlFor="title" className="block mb-1">
          Video Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          placeholder="Some title..."
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="upload" className="block mb-2">
          Upload Video <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="upload"
            name="upload"
            type="file"
            onChange={handleChange}
            accept=".mp4, .mkv, .ogg, .wmv"
            className="hidden"
            required
          />
          <label
            htmlFor="upload"
            className="cursor-pointer bg-orange-400 text-white py-2 px-4 rounded-md shadow-md hover:bg-orange-500 transition duration-300"
          >
            Select File
          </label>
          <span className="ml-2">{formData.selectedFile}</span>
        </div>
      </div>
      <Button
        type="submit"
        disabled={formData.selectedFile === "No file selected" || loading}
        className={
          formData.selectedFile === "No file selected"
            ? "cursor-not-allowed opacity-55"
            : ""
        }
      >
        {loading ? "Loading..." : "Submit"}
      </Button>
    </form>
  );
};

export default FormVideo;
