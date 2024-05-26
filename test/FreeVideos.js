const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FreeVideos", function () {
  let deployer;
  let freeVideos;

  before(async function () {
    try {
      [deployer] = await ethers.getSigners(); // Getting the deployer signer

      const network = await ethers.provider.getNetwork();
      const contractFactory = await ethers.getContractFactory("FreeVideos");
      freeVideos = await contractFactory.deploy();
      await freeVideos.deployed();

      console.log(
        `FreeVideos deployed to: ${freeVideos.address}\n` +
          `on network: ${network.chainId}\n` +
          `by deployer: ${deployer.address}`
      );
    } catch (error) {
      console.error("Initialization failed:", error);
    }
  });

  describe("Deployment of the contract =====", () => {
    it("contract deployed successfully and has an address", async () => {
      expect(freeVideos).to.not.be.undefined;
      const address = await freeVideos.address;
      expect(address).to.satisfy(
        (address) =>
          address !== 0x0 &&
          address !== "" &&
          address !== null &&
          address !== undefined
      );
      expect(address).to.be.a("string");
    });

    it("check the name of the contract", async () => {
      const name = await freeVideos.name();
      expect(name).to.equal("FreeVideos");
    });

    it("videoCount should be 0", async () => {
      const videoCount = await freeVideos.videoCount();
      expect(videoCount).to.equal(0);
    });

    it("check the owner of the contract", async () => {
      const owner = await freeVideos.owner();
      expect(owner).to.equal(deployer.address);
    });
  });

  describe("Upload videos =====", () => {
    let txReceipt, videoCount;
    const videoTitle = "Video title";
    const hash = "QmevgiAivhBRShk6V3Ehd7TitYxGXphXU2PToU4o9MsZWS";

    before(async () => {
      try {
        // Capture the transaction response
        const txResponse = await freeVideos.uploadVideo(hash, videoTitle, {
          from: deployer.address,
        });

        // Wait for the transaction to be mined
        txReceipt = await txResponse.wait();

        videoCount = await freeVideos.videoCount();
      } catch (error) {
        console.error("Error in video handling:", error);
      }
    });

    // check the event emitted when a video is uploaded
    it("creates videos", async () => {
      // Expect there is exactly one event emitted
      expect(txReceipt.events.length).to.equal(1);

      // Get the event details from the transaction receipt
      const event = txReceipt.events[0].args;
      // console.log("txReceipt", event);

      // Assertions to check the event details
      expect(event.id.toNumber()).to.equal(1);
      expect(event.hash).to.equal(hash);
      expect(event.title).to.equal(videoTitle);
      expect(event.sender).to.equal(deployer.address);

      // Additional tests for empty inputs
      await expect(
        freeVideos.uploadVideo("", videoTitle, { from: deployer.address })
      ).to.be.revertedWith("Should have a hash");

      await expect(
        freeVideos.uploadVideo(hash, "", { from: deployer.address })
      ).to.be.revertedWith("Should have a title");
    });

    // check list of videos uploaded
    it("lists videos", async () => {
      const video = await freeVideos.videos(videoCount);
      expect(video.id.toNumber()).to.equal(videoCount.toNumber());
      expect(video.hash).to.equal(hash);
      expect(video.title).to.equal(videoTitle);
      expect(video.author).to.equal(deployer.address);
    });
  });
});
