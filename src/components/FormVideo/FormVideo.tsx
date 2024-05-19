import { useState, FC, ChangeEvent, FormEvent, useEffect } from "react";
import Button from "../UI/Button";

import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { MemoryBlockstore } from "blockstore-core";
import useBlockchain from "../../hooks/useBlockchain";
import { ethers } from "ethers";

type FormError = string | Error | null;

interface FormData {
  title: string;
  selectedFile: string;
  bufferFile: Uint8Array | null;
  cid: string;
}

const FormVideo: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "Bunny",
    selectedFile: "No file selected",
    bufferFile: null,
    cid: "",
  });

  const { provider, contract } = useBlockchain();
  const [errors, setErrors] = useState<FormError>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: e.target.value,
    }));
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    // Check if there are no files selected and reset the form data
    if (!e.target.files || e.target.files.length === 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        bufferFile: null,
        selectedFile: "No file selected",
      }));
      setLoading(false);
      return;
    }

    try {
      const fileUpload = e.target.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(fileUpload);

      reader.onload = async () => {
        // Persistent Peer ID
        const blockstore = new MemoryBlockstore();
        // Create a new Helia node and start it up persistently
        const node = await createHelia({ blockstore });
        // create a filesystem on top of Helia, in this case it's UnixFS
        const fs = unixfs(node);
        // add the bytes to your node and receive a unique content identifier
        const cid = await fs.addBytes(
          new Uint8Array(reader.result as ArrayBuffer)
        );

        console.log("Added file:", cid.toString());

        setFormData((prevFormData) => ({
          ...prevFormData,
          selectedFile: fileUpload.name,
          bufferFile: new Uint8Array(reader.result as ArrayBuffer),
          cid: cid.toString(),
        }));

        // the node is stopped
        await node.stop();
        setLoading(false);
      };

      reader.onerror = () => {
        setErrors(reader.error);
        setLoading(false);
      };
    } catch (error) {
      setErrors(error as FormError);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!provider || !contract) {
      return;
    }
    
    setLoading(true);
    console.log(formData);

    try {      
      // Get the signer from the provider
      const signer = provider.getSigner();
      // Connect the contract to the signer
      const contractWithSigner = contract.connect(signer);
      // Get the fee data from the provider
      const feeData = await provider.getFeeData();
      // Upload the CID and the title to the blockchain
      const tx = await contractWithSigner.uploadVideo(
        formData.cid,
        formData.title,
        {
          maxFeePerGas: feeData.maxFeePerGas,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
          value: ethers.utils.parseEther("0"),
        }
      );
      await tx.wait();
      console.log("Transaction mined:", tx.hash);

      const contractOwner = await contractWithSigner.owner();
      const videoCount = await contractWithSigner.videoCount();

      const videoArr = [];
      for (let i = videoCount; i >= 1; i--) {
        const getVideo = await contractWithSigner.videos(i);
        const { id, title, hash, author } = getVideo;
        videoArr.push({ id, title, hash, author });
      }

      console.log({
        videoArr,
        contractOwner,
        videoCount: videoCount.toString(),
      });
    } catch (error) {
      console.log("Error: ", error);
      setErrors(error as FormError);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
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
      {errors && <p>Error: {errors.toString()}</p>}
    </form>
  );
};

export default FormVideo;
