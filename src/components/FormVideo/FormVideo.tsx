
import { useState, FC, ChangeEvent, FormEvent, useEffect } from "react";
import Button from "../UI/Button";
import { ethers, BigNumber } from "ethers";
import useHelia from "../../hooks/useHelia";
import { IPFS_BASE_URL } from "../../constants";
import { useWallet } from "../../contexts/WalletContext";
import transactionPreview from "@web3-onboard/transaction-preview";

type FormError = string | Error | null;

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
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    selectedFile: "No file selected",
    bufferFile: null,
  });

  useEffect(() => {
    if (contract) {
      contract.on("VideoAdded", handleVideoAdded);
      return () => {
        contract.off("VideoAdded", handleVideoAdded);
      };
    }
  }, [contract]);

  const handleVideoAdded = (
    id: BigNumber,
    hash: string,
    title: string,
    author: string
  ) => {
    console.log("Video added:", id.toString(), hash, title, author);
    const newVideo = {
      id,
      title,
      hash,
      author,
    };
    onVideoAdded(newVideo);
    setVideoUrl(`${IPFS_BASE_URL}${hash}`);
    setLoading(false);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: e.target.value,
    }));
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      updateFormData(null, "No file selected");
      return;
    }

    const fileUpload = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const buffer = new Uint8Array(reader.result as ArrayBuffer);
      updateFormData(buffer, fileUpload.name);
    };

    reader.onerror = () => {
      handleNotification({
        eventCode: "error",
        type: "error",
        message: "Error handle upload file",
      });
    };

    reader.readAsArrayBuffer(fileUpload);
  };

  const updateFormData = (
    bufferFile: Uint8Array | null,
    selectedFile: string
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      bufferFile,
      selectedFile,
    }));
  };

  const buildTransaction = async (cid: string, title: string) => {
    if (!provider || !contract || !signer) {
      handleNotification({
        eventCode: "error",
        type: "error",
        message: "Blockchain provider, contract, or signer not available.",
      });
      setLoading(false);
      throw new Error("Blockchain provider, contract, or signer not available.");
    }

    const feeData = await provider.getFeeData();
    const nonce = await signer.getTransactionCount();

    const maxFeePerGas =
      feeData.maxFeePerGas || ethers.utils.parseUnits("10", "gwei");
    const maxPriorityFeePerGas =
      feeData.maxPriorityFeePerGas || ethers.utils.parseUnits("1", "gwei");

    return {
      to: contract.address,
      data: contract.interface.encodeFunctionData("uploadVideo", [cid, title]),
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      value: ethers.utils.parseEther("0"), // Ensure value is defined
    };
  };

  const sendTransaction = async (transaction: ethers.PopulatedTransaction) => {
    if (!provider || !signer) {
      handleNotification({
        eventCode: "error",
        type: "error",
        message: "Blockchain provider or signer not available.",
      });
      setLoading(false);
      throw new Error("Blockchain provider or signer not available.");
    }

    const txResponse = await signer.sendTransaction(transaction);
    console.log("txResponse", txResponse);
    await txResponse.wait();

    handleNotification({
      eventCode: "transactionSent",
      type: "hint",
      message: "Transaction sent successfully!",
    });
  };

  const onCidObtained = async (cid: string) => {
    try {
      const { title } = formData;
      const transaction = await buildTransaction(cid, title);

      console.log(transaction)
      // Preview transaction
      // const txPreview = await transactionPreview.previewTransaction([
      //   transaction,
      // ]);
      // const popTransaction = await signer.populateTransaction(txPreview);

      await sendTransaction(transaction);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    console.error("Error adding video:", error);
    handleNotification({
      eventCode: "error",
      type: "error",
      message: `Error adding video: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });
    setLoading(false);
  };

  const { handleFileUpload } = useHelia(onCidObtained);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.bufferFile) {
      setLoading(false);
      handleNotification({
        eventCode: "error",
        type: "error",
        message: "No file buffer available.",
      });
      return;
    }

    try {
      await handleFileUpload(formData.bufferFile);
    } catch (uploadError) {
      handleError(uploadError);
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
          placeholder="Some title..."
          name="title"
          type="text"
          value={formData.title}
          onChange={handleTitleChange}
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
            type="file"
            onChange={handleUpload}
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
          <span className="ml-2" id="fileName">
            {formData.selectedFile}
          </span>
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