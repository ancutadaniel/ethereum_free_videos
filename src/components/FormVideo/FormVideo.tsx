// components/FormVideo/FormVideo.tsx
import { useState, FC, ChangeEvent, FormEvent } from 'react';
import Button from '../UI/Button';
import useBlockchain from '../../hooks/useBlockchain';
import { BigNumber, ethers } from 'ethers';
import useHelia from '../../hooks/useHelia';
import { IPFS_BASE_URL } from '../../constants';

type FormError = string | Error | null;

interface FormData {
  title: string;
  selectedFile: string;
  bufferFile: Uint8Array | null;
}

interface EthereumError extends Error {
  data?: {
    [key: string]: unknown;
  };
}

const FormVideo: FC<{ onVideoAdded: (video: { id: BigNumber; title: string; hash: string; author: string }) => void }> = ({ onVideoAdded }) => {
  const [formData, setFormData] = useState<FormData>({
    title: 'Bunny',
    selectedFile: 'No file selected',
    bufferFile: null,
  });

  const { provider, contract } = useBlockchain();
  const { cid, error, handleFileUpload } = useHelia();

  const [errors, setErrors] = useState<FormError>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: e.target.value,
    }));
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    if (!e.target.files || e.target.files.length === 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        bufferFile: null,
        selectedFile: 'No file selected',
      }));
      setLoading(false);
      return;
    }

    const fileUpload = e.target.files[0];
    const reader = new FileReader();

    reader.readAsArrayBuffer(fileUpload);

    reader.onload = () => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectedFile: fileUpload.name,
        bufferFile: new Uint8Array(reader.result as ArrayBuffer),
      }));
      setLoading(false);
    };

    reader.onerror = () => {
      setErrors(reader.error);
      setLoading(false);
    };
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!provider || !contract || !formData.bufferFile) {
      setLoading(false);
      return;
    }

    try {
      await handleFileUpload(formData.bufferFile);
      if (cid) {
        const signer = provider.getSigner();
        const feeData = await provider.getFeeData();

        const nonce = await signer.getTransactionCount("latest");

        const maxFeePerGas = feeData.maxFeePerGas ? BigNumber.from(feeData.maxFeePerGas) : ethers.utils.parseUnits("10", "gwei");
        const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ? BigNumber.from(feeData.maxPriorityFeePerGas) : ethers.utils.parseUnits("1", "gwei");

        const { title } = formData;

        const tx = await contract.uploadVideo(cid, title, {
          nonce,
          maxFeePerGas,
          maxPriorityFeePerGas,
          gasLimit: BigNumber.from("1000000"),
          value: ethers.utils.parseEther("0"),
        });

        const receipt = await tx.wait();

        const newVideo = { id: BigNumber.from(receipt.logs[0].topics[1]), title, hash: cid, author: await signer.getAddress() };
        onVideoAdded(newVideo);

        setVideoUrl(`${IPFS_BASE_URL}${cid}`);
      }

    } catch (error) {
      const ethError = error as EthereumError;
      setErrors(`Error adding video: ${ethError.message}`);
    } finally {
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
        disabled={formData.selectedFile === 'No file selected' || loading}
        className={
          formData.selectedFile === 'No file selected'
            ? 'cursor-not-allowed opacity-55'
            : ''
        }
      >
        {loading ? 'Loading...' : 'Submit'}
      </Button>
      {errors && <p>Error: {errors.toString()}</p>}
      {error && <p>Error: {error}</p>}
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
