import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("Setup Native Swap", function () {

  let chainId: BigNumber = BigNumber.from(123);

  it("Should return the new greeting once it's changed", async function () {

    let signers = await ethers.getSigners()
    let ownerSigner = await ethers.getSigner(signers[0].address)
    let userSigner = await ethers.getSigner(signers[1].address)
    let receiverSigner = await ethers.getSigner(signers[2].address)

    const LZEndpointMock = await ethers.getContractFactory("LZEndpointMock");
    const lzEndpointMock = await LZEndpointMock.deploy(chainId);
    await lzEndpointMock.deployed();

    console.log("LZEndpointMock: ", lzEndpointMock.address);

    const NativeSwap = await ethers.getContractFactory("NativeSwap");

    const nativeSwap_a = await NativeSwap.deploy(lzEndpointMock.address, chainId);
    await nativeSwap_a.deployed();

    console.log("native swap a: ", nativeSwap_a.address);

    const nativeSwap_b = await NativeSwap.deploy(lzEndpointMock.address, chainId);
    await nativeSwap_b.deployed();

    console.log("native swap b: ", nativeSwap_b.address);

    await lzEndpointMock.setDestLzEndpoint(nativeSwap_a.address, lzEndpointMock.address);
    await lzEndpointMock.setDestLzEndpoint(nativeSwap_b.address, lzEndpointMock.address);

    // Set trusted source

    await nativeSwap_a.setTrustedRemote(chainId, ethers.utils.solidityPack(["address", "address"], [nativeSwap_b.address, nativeSwap_a.address]));
    await nativeSwap_b.setTrustedRemote(chainId, ethers.utils.solidityPack(["address", "address"], [nativeSwap_a.address, nativeSwap_b.address]));

    await nativeSwap_a.connect(userSigner).swap(receiverSigner.address, ethers.utils.parseEther("100"), {value: ethers.utils.parseEther("100.015")});
    await nativeSwap_a.connect(userSigner).swap(receiverSigner.address, ethers.utils.parseEther("100"), {value: ethers.utils.parseEther("100.015")});

    console.log("receiver: ", ethers.utils.formatUnits((await ethers.provider.getBalance(receiverSigner.address))))
    console.log("user: ", ethers.utils.formatUnits((await ethers.provider.getBalance(userSigner.address))))

    console.log("ssss: ", ethers.utils.formatUnits("15000000000000000"));

    console.log()

  });
});