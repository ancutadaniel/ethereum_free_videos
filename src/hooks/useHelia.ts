// hooks/useHelia.ts
import { useState, useCallback } from "react";
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { MemoryBlockstore } from "blockstore-core";

const useHelia = () => {
  const [cid, setCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (buffer: Uint8Array) => {
    try {
      const blockstore = new MemoryBlockstore();
      const helia = await createHelia({ blockstore });
      const fs = unixfs(helia);

      const cid = await fs.addBytes(buffer);
      setCid(cid.toString());

      // Stop the Helia node after getting the CID
      await helia.stop();
      console.log("Helia node stopped successfully");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  }, []);

  return { cid, error, handleFileUpload };
};

export default useHelia;
