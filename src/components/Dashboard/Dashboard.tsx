import { FC, useEffect, useState, useRef, useCallback } from "react";
import FormVideo from "../FormVideo/FormVideo";
import VideoList from "../VideoList/VideoList";
import { BigNumberish } from "ethers";
import { IPFS_BASE_URL } from "../../constants";
import { useWallet } from "../../contexts/WalletContext";

interface DashboardProps {
  selectedItem: string;
  className?: string;
}

interface Video {
  id: BigNumberish;
  title: string;
  hash: string;
  author: string;
}

interface EthereumError extends Error {
  code: number;
  data?: Record<string, unknown>;
}

const Dashboard: FC<DashboardProps> = ({ selectedItem, className }) => {
  const { provider, contract, handleNotification } = useWallet();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const mainDashRef = useRef<HTMLDivElement>(null);

  const getVideos = useCallback(async () => {
    if (!provider || !contract) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const latestBlockNumber = await provider.getBlockNumber();
      const videoCount = await contract.videoCount({
        blockTag: latestBlockNumber,
      });

      if (videoCount.isZero()) {
        setVideos([]);
        setLoading(false);
        return;
      }

      const videoArr: Video[] = [];
      for (let i = videoCount; i.gte(1); i = i.sub(1)) {
        const getVideo = await contract.videos(i, {
          blockTag: latestBlockNumber,
        });
        const { id, title, hash, author } = getVideo;
        videoArr.push({ id, title, hash, author });
      }

      setVideos(videoArr);
      if (videoArr.length > 0) {
        setSelectedVideo(videoArr[0]);
      }
    } catch (error) {
      const ethError = error as EthereumError;
      handleNotification({
        eventCode: "error",
        type: "error",
        message: `Error fetching videos: ${ethError.message}`,
      });
      setError(`Error fetching videos: ${ethError.message}`);
    } finally {
      setLoading(false);
    }
  }, [provider, contract, handleNotification]);

  useEffect(() => {
    getVideos();

    if (contract) {
      const handleVideoAdded = (
        id: BigNumberish,
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
  }, [contract, getVideos]);

  useEffect(() => {
    if (mainDashRef.current) {
      mainDashRef.current.scrollTop = 0;
    }
  }, [selectedVideo]);

  return (
    <div
      className={`flex flex-col bg-green-100 ${className}`}
      style={{ overflowY: "auto" }}
      ref={mainDashRef}
    >
      <div className="p-4 flex-none">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <p>Selected Item: {selectedItem}</p>
      </div>
      <div
        id="main_dash"
        className="flex flex-col md:flex-row flex-grow mx-4 mb-4 space-y-4 md:space-y-0 md:space-x-4"
      >
        <div className="md:w-8/12 w-full">
          <div className="bg-white p-4 rounded shadow-md flex flex-col h-full">
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
                    <video controls className="w-full">
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
        <div id="form_video" className="bg-blue-200 md:w-4/12 w-full h-full">
          <div className="p-4 rounded shadow-md h-full flex flex-col">
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
    </div>
  );
};

export default Dashboard;
