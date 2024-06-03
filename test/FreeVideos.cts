import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("FreeVideos", function () {
  let freeVideos, owner, network;

  async function deployUsersFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const network = await hre.ethers.provider.getNetwork();
    const contractFactory = await hre.ethers.getContractFactory("FreeVideos");
    const freeVideos = await contractFactory.deploy();

    return { freeVideos, owner, otherAccount, network };
  }

  before(async function () {
    try {
      const fixture = await loadFixture(deployUsersFixture);
      freeVideos = fixture.freeVideos;
      owner = fixture.owner;
      network = fixture.network;

      console.log(
        `FreeVideos deployed to: ${freeVideos.target}\n` +
          `on network: ${network.chainId}\n` +
          `by deployer: ${owner.address}`
      );
    } catch (error) {
      console.error("Initialization failed:", error);
    }
  });

  describe("Deployment of the contract =====", () => {
    it("contract deployed successfully and has an address", async () => {
      expect(freeVideos).to.not.be.undefined;
      const address = freeVideos.target;
      expect(address).to.be.a("string");
      expect(address).to.not.satisfy(
        (addr) => addr === 0x0 || addr === "" || addr === null || addr === undefined
      );
    });

    it("check the name of the contract", async () => {
      const name = await freeVideos.name();
      expect(name).to.equal("FreeVideos");
    });

    it("videoCount should be 0", async () => {
      const videoCount = await freeVideos.videoCount();
      expect(videoCount).to.equal(0n); // Ensuring BigInt handling
    });

    it("check the owner of the contract", async () => {
      expect(await freeVideos.owner()).to.equal(owner.address);
    });
  });

  describe("Upload videos =====", () => {
    const videoTitle = "Video title";
    const hash = "QmevgiAivhBRShk6V3Ehd7TitYxGXphXU2PToU4o9MsZWS";

    before(async () => {
      const fixture = await loadFixture(deployUsersFixture);
      freeVideos = fixture.freeVideos;
      owner = fixture.owner;
    });

    // check the event emitted when a video is uploaded
    it("creates videos and emits an event", async () => {
      // Capture the transaction response
      const txResponse = await freeVideos.uploadVideo(hash, videoTitle, {
        from: owner.address,
      });

      // Wait for the transaction to be mined
      const txReceipt = await txResponse.wait();

      // Check if the event is emitted
      await expect(txResponse)
        .to.emit(freeVideos, "VideoAdded")
        .withArgs(1n, hash, videoTitle, owner.address);

      // Ensure video count is incremented
      const updatedVideoCount = await freeVideos.videoCount();
      expect(updatedVideoCount).to.equal(1n);
    });

    // check list of videos uploaded
    it("lists videos", async () => {
      const videoCount = await freeVideos.videoCount();
      expect(videoCount).to.equal(1n); // Ensure the video count is 1

      const video = await freeVideos.videos(1n); // Get the first video (index 1)

      expect(video.id).to.equal(1n);
      expect(video.hash).to.equal(hash);
      expect(video.title).to.equal(videoTitle);
      expect(video.author).to.equal(owner.address);
    });

    // Additional tests for empty inputs
    it("should revert with empty hash", async () => {
      await expect(
        freeVideos.uploadVideo("", videoTitle, { from: owner.address })
      ).to.be.revertedWith("Should have a hash");
    });

    it("should revert with empty title", async () => {
      await expect(
        freeVideos.uploadVideo(hash, "", { from: owner.address })
      ).to.be.revertedWith("Should have a title");
    });
  });
});
