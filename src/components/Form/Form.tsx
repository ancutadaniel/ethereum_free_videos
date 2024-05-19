import React, { useState, FC, ChangeEvent, FormEvent } from "react";
import Button from "../UI/Button";

type FormError = string | Error | null;

interface FormData {
  title: string;
  selectedFile: string;
  bufferFile: Uint8Array | null;
}

const Form: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "Some title...",
    selectedFile: "No file selected",
    bufferFile: null,
  });
  const [errors, setErrors] = useState<FormError>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: e.target.value,
    }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    try {
      if (!e.target.files || e.target.files.length === 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          bufferFile: null,
          selectedFile: "No file selected",
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
    } catch (error) {
      setErrors(error as FormError);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting form...");
    console.log("Title: ", formData.title);
    console.log("Buffer File: ", formData.bufferFile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-1">
          Video Title
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
        <label htmlFor="upload" className="block mb-1">
          Upload Video
        </label>
        <div className="relative">
          <input
            id="upload"
            type="file"
            onChange={handleFileUpload}
            accept=".mp4, .mkv, .ogg, .wmv"
            className="hidden"
            required
          />
          <label
            htmlFor="upload"
            className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
          >
            Select File
          </label>
          <span className="ml-2" id="fileName">
            {formData.selectedFile}
          </span>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {errors && <p>Error: {errors.toString()}</p>}
      <Button
        type="submit"
        disabled={formData.selectedFile === "No file selected"}
        className={
          formData.selectedFile === "No file selected"
            ? "cursor-not-allowed opacity-55"
            : ""
        }
      >
        Submit
      </Button>
    </form>
  );
};

export default Form;
