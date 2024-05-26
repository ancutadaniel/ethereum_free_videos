import { useEffect } from "react";
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer'; // Import Buffer from the buffer module

const useInfura = () => {
  useEffect(() => {
    const projectId = process.env.REACT_APP_INFURA_ID;
    const projectSecret = process.env.REACT_APP_INFURA_SECRET_KEY;

    if (!projectId || !projectSecret) {
      console.error('Project ID or Project Secret is missing.');
      return;
    }

    const authHeader = "Basic " + Buffer.from(`${projectId}:${projectSecret}`).toString("base64");

    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: authHeader,
      },
    });

    // Check connection
    const checkConnection = async () => {
      try {
        const infura = await client;
        console.log('Connected to Infura IPFS:', infura);
      } catch (err) {
        console.error('Connection to Infura IPFS failed:', err);
      }
    };

    // Add a test file to IPFS
    const addTestFile = async () => {
      try {
        const file = new Blob(["Hello, IPFS!"], { type: 'text/plain' });
        const added = await client.add(file);
        console.log('File added to IPFS with CID:', added.path);
      } catch (err) {
        console.error('Failed to add file to Infura IPFS:', err);
      }
    };

    checkConnection();
    addTestFile();
  }, []);

  return null;
};

export default useInfura;
