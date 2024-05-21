import React, { ChangeEvent, useState } from "react";
import useHelia from "../../hooks/useHelia";

const HeliaComponent = () => {
  const { cid, error, handleFileUpload } = useHelia();
  const [file, setFile] = useState<File | null>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setFile(e.target.files[0]);
  };

  const onUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const buffer = new Uint8Array(reader.result as ArrayBuffer);
        handleFileUpload(buffer);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button onClick={onUpload}>Upload</button>
      {cid && <p>CID: {cid}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default HeliaComponent;
