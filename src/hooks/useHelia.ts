// hooks/useHelia.ts
import { useState, useCallback } from "react";
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

interface HeliaHook {
  cid: string | null;
  error: string | null;
  handleFileUpload: (buffer: Uint8Array) => void;
}

const useHelia = (onCidObtained: (cid: string) => Promise<void>): HeliaHook => {
  const [cid, setCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (buffer: Uint8Array) => {
    try {
      const helia = await createHelia();
      const fs = unixfs(helia);

      const cid = await fs.addBytes(buffer);
      setCid(cid.toString());

      // Ensure CID is set before stopping the node
      if (cid) {
        await helia.stop();
        console.log("Helia node stopped successfully");
        await onCidObtained(cid.toString());
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  }, [onCidObtained]);

  return { cid, error, handleFileUpload };
};

export default useHelia;