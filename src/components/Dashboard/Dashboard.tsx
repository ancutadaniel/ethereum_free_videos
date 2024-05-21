// components/Dashboard/Dashboard.tsx
import { FC, useEffect, useState } from "react";
import FormVideo from "../FormVideo/FormVideo";
import VideoList from "../VideoList/VideoList";
import useBlockchain from "../../hooks/useBlockchain";
import { BigNumber } from "ethers";
import { IPFS_BASE_URL } from "../../constants";

interface DashboardProps {
  selectedItem: string;
  className?: string;
}

interface Video {
  id: BigNumber;
  title: string;
  hash: string;
  author: string;
}

interface EthereumError extends Error {
  code: number;
  data?: Record<string, unknown>;
}

const Dashboard: FC<DashboardProps> = ({ selectedItem, className }) => {
  const { provider, contract, isInitialized, checkBlockNumber } = useBlockchain();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const getVideos = async () => {
    if (!isInitialized || !provider || !contract) {
      setError("Blockchain not initialized");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const latestBlockNumber = await provider.getBlockNumber();

      // Validate the latest block number
      try {
        await checkBlockNumber(latestBlockNumber);
      } catch (blockError) {
        setError((blockError as Error).message);
        setLoading(false);
        return;
      }

      const videoCount = await contract.videoCount({ blockTag: latestBlockNumber });
      if (videoCount.isZero()) {
        setVideos([]);
        setLoading(false);
        return;
      }

      const videoArr: Video[] = [];
      for (let i = videoCount; i.gte(1); i = i.sub(1)) {
        const getVideo = await contract.videos(i, { blockTag: latestBlockNumber });
        const { id, title, hash, author } = getVideo;
        videoArr.push({ id, title, hash, author });
      }

      setVideos(videoArr);
      if (videoArr.length > 0) {
        setSelectedVideo(videoArr[0]);
      }
    } catch (error) {
      const ethError = error as EthereumError;
      setError(`Error fetching videos: ${ethError.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideos();

    if (contract) {
      const handleVideoAdded = (
        id: BigNumber,
        hash: string,
        title: string,
        author: string
      ) => {
        const newVideo = { id, title, hash, author };
        setVideos((prevVideos) => [newVideo, ...prevVideos]);
        setSelectedVideo(newVideo);
      };

      contract.on("VideoAdded", handleVideoAdded);

      return () => {
        contract.off("VideoAdded", handleVideoAdded);
      };
    }
  }, [isInitialized, contract]);

  return (
    <div className={`flex flex-col bg-green-100 overflow-y-auto ${className}`}>
      <div className="p-4 flex-none">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <p>Selected Item: {selectedItem}</p>
      </div>
      <div className="flex flex-col md:flex-row flex-grow h-full mx-4 mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <div className="bg-blue-200 md:w-5/12 w-full order-1 md:order-2 h-full ml-4">
          <div className="p-4 rounded shadow-md h-full overflow-y-auto">
            <div className="overflow-y-auto h-4/5">
              <FormVideo
                onVideoAdded={(video) => {
                  setVideos((prevVideos) => [video, ...prevVideos]);
                  setSelectedVideo(video);
                }}
              />
              <VideoList videos={videos} onVideoSelect={setSelectedVideo} />
            </div>
          </div>
        </div>
        <div className="md:w-7/12 w-full order-2 md:order-1 h-full">
          <div className="bg-white p-4 rounded shadow-md h-full flex overflow-y-auto">
            {loading ? (
              <p>Loading videos...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              selectedVideo && (
                <div className="mt-4 text-left w-full">
                  <h2 className="text-2xl font-bold mb-4">
                    {selectedVideo.title}
                  </h2>
                  <div className="relative w-full overflow-hidden rounded-md shadow-lg">
                    <video
                      controls
                      className="w-full h-auto"
                    >
                      <source
                        src={`${IPFS_BASE_URL}${selectedVideo.hash}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
