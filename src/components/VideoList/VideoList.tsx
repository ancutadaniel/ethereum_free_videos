import { FC, memo } from "react";
import { BigNumberish } from "ethers";
import { IPFS_BASE_URL } from "../../constants";
import * as blockies from "ethereum-blockies";

interface Video {
  id: BigNumberish;
  title: string;
  hash: string;
  author: string;
}

interface VideoListProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
}

const VideoList: FC<VideoListProps> = ({ videos, onVideoSelect }) => {
   return (
    <div className="space-y-4">
      {videos.map((video, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 rounded-md shadow-md cursor-pointer hover:bg-gray-100 transition duration-300"
          onClick={() => onVideoSelect(video)}
        >
          <div className="flex items-center space-x-4">
            <img
              src={blockies.create({ seed: video.author }).toDataURL()}
              alt="Identicon"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-bold">Title: {video.title}</p>
              <p className="text-gray-600">
                Author: {video.author.slice(0, 6)}...{video.author.slice(-4)}
              </p>
            </div>
          </div>
          <video className="w-full mt-2 rounded-md shadow-md">
            <source src={`${IPFS_BASE_URL}${video.hash}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
    </div>
  );
};

export default memo(VideoList);
