import { useState, FC, ChangeEvent, FormEvent, useEffect } from "react";
import Button from "../UI/Button";
import useBlockchain from "../../hooks/useBlockchain";
import { BigNumber, ethers } from "ethers";
import useHelia from "../../hooks/useHelia";
import { IPFS_BASE_URL } from "../../constants";

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
  const { provider, contract } = useBlockchain();

  const [errors, setErrors] = useState<FormError>(null);
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

  const handleVideoAdded = (id: BigNumber, hash: string, title: string, author: string) => {
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
      setErrors(reader.error);
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

  const onCidObtained = async (cid: string) => {
    if (!provider || !contract) {
      setErrors("Blockchain provider or contract not available.");
      setLoading(false);
      return;
    }

    try {
      const { title } = formData;
      const signer = provider.getSigner();
      const feeData = await provider.getFeeData();
      const nonce = await signer.getTransactionCount("latest");

      const maxFeePerGas =
        feeData.maxFeePerGas || ethers.utils.parseUnits("10", "gwei");
      const maxPriorityFeePerGas =
        feeData.maxPriorityFeePerGas || ethers.utils.parseUnits("1", "gwei");

      await contract.uploadVideo(cid, title, {
        nonce,
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit: BigNumber.from("1000000"),
        value: ethers.utils.parseEther("0"),
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    console.error("Error adding video:", error);
    setErrors(error as FormError);
    setLoading(false);
  };

  const { handleFileUpload } = useHelia(onCidObtained);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.bufferFile) {
      setErrors("No file buffer available.");
      setLoading(false);
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
      {errors && <p className="text-red-500">{errors.toString()}</p>}
      {videoUrl && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Latest Video</h2>
          <video controls className="w-full mt-2">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </form>
  );
};

export default FormVideo;
