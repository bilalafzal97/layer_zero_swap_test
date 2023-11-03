import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("Setup Mock", function () {

  let chainId: BigNumber = BigNumber.from(123);

  it("Should return the new greeting once it's changed", async function () {
    const LZEndpointMock = await ethers.getContractFactory("LZEndpointMock");
    const lzEndpointMock = await LZEndpointMock.deploy(chainId);
    await lzEndpointMock.deployed();

    console.log("LZEndpointMock: ", lzEndpointMock.address);

    const Counter = await ethers.getContractFactory("Counter");

    const counter_a = await Counter.deploy(lzEndpointMock.address);
    await counter_a.deployed();

    console.log("Counter A: ", counter_a.address);

    const counter_b = await Counter.deploy(lzEndpointMock.address);
    await counter_b.deployed();

    console.log("Counter B: ", counter_b.address);


    await lzEndpointMock.setDestLzEndpoint(counter_a.address, lzEndpointMock.address);
    await lzEndpointMock.setDestLzEndpoint(counter_b.address, lzEndpointMock.address);

    // Set trusted source

    await counter_a.setTrustedRemote(chainId, ethers.utils.solidityPack(["address", "address"], [counter_b.address, counter_a.address]));
    await counter_b.setTrustedRemote(chainId, ethers.utils.solidityPack(["address", "address"], [counter_a.address, counter_b.address]));


    expect(await counter_a.counter()).to.be.equal(0);
    expect(await counter_b.counter()).to.be.equal(0);

    await counter_a.incrementCounter(chainId, {
      value: ethers.utils.parseEther("0.02")
    });

    expect(await counter_a.counter()).to.be.equal(0);
    expect(await counter_b.counter()).to.be.equal(1);

    await counter_a.incrementCounter(chainId, {
      value: ethers.utils.parseEther("0.02")
    });

    expect(await counter_a.counter()).to.be.equal(0);
    expect(await counter_b.counter()).to.be.equal(2);

    await counter_b.incrementCounter(chainId, {
      value: ethers.utils.parseEther("0.02")
    });

    expect(await counter_a.counter()).to.be.equal(1);
    expect(await counter_b.counter()).to.be.equal(2);
  });

  // Eth <> BSC
  // Eth <> Ploy
  // Ploy <> BCS

});