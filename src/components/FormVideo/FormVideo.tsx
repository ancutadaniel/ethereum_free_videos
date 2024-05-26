import {
  useState,
  FC,
  ChangeEvent,
  FormEvent,
  useEffect,
  useCallback,
} from "react";
import Button from "../UI/Button";
import { ethers, BigNumber } from "ethers";
import useHelia from "../../hooks/useHelia";
import { useWallet } from "../../contexts/WalletContext";

interface FormData {
  title: string;
  selectedFile: string;
  bufferFile: Uint8Array | null;
}

const FormVideo: FC<{
  onVideoAdded: (video: {
    id: BigNumber;
    title: string;
    hash: string;
    author: string;
  }) => void;
}> = ({ onVideoAdded }) => {
  const { provider, contract, handleNotification, signer } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    selectedFile: "No file selected",
    bufferFile: null,
  });

  useEffect(() => {
    if (!contract) return;

    const handleVideoAdded = (
      id: BigNumber,
      hash: string,
      title: string,
      author: string
    ) => {
      onVideoAdded({ id, title, hash, author });
      setLoading(false);
    };

    contract.on("VideoAdded", handleVideoAdded);
    return () => {
      contract.off("VideoAdded", handleVideoAdded);
    };
  }, [contract, onVideoAdded]);

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

      const feeData = await provider.getFeeData();
      const nonce = await signer.getTransactionCount();
      const maxFeePerGas =
        feeData.maxFeePerGas || ethers.utils.parseUnits("10", "gwei");
      const maxPriorityFeePerGas =
        feeData.maxPriorityFeePerGas || ethers.utils.parseUnits("1", "gwei");

      const transaction = {
        to: contract.address,
        data: contract.interface.encodeFunctionData("uploadVideo", [
          cid,
          formData.title,
        ]),
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        value: ethers.utils.parseEther("0"),
      };

      const txResponse = await signer.sendTransaction(transaction);
      await txResponse.wait();
      handleNotification({
        eventCode: "transactionSent",
        type: "hint",
        message: "Transaction sent successfully!",
      });
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
        message: `Error adding video: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
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
