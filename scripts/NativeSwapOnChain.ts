import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {
  let signers = await ethers.getSigners()
  let ownerSigner = await ethers.getSigner(signers[0].address)
  let userSigner = await ethers.getSigner(signers[1].address)
  let receiverSigner = await ethers.getSigner(signers[2].address)

  const NativeSwap = await ethers.getContractFactory("NativeSwap");


  const nativeSwap_bsc_address = "0xD47eAb1b6dB090bAC33EAAfF72CA06F660A11E0c";
  const nativeSwap_bsc = NativeSwap.attach(nativeSwap_bsc_address);
  // const nativeSwap_bsc = await NativeSwap.deploy("0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1", BigNumber.from(10109));
  // await nativeSwap_bsc.deployed();

  const nativeSwap_poly_address = "0x1825135b1CefA314982eE3e853cB33E3931CB246";
  const nativeSwap_poly = NativeSwap.attach(nativeSwap_poly_address);
  // const nativeSwap_poly = await NativeSwap.deploy("0xf69186dfBa60DdB133E91E9A4B5673624293d8F8", BigNumber.from(10102));
  // await nativeSwap_poly.deployed();

  // Set Trust

  // await nativeSwap_bsc.setTrustedRemoteAddress(BigNumber.from(10109), nativeSwap_poly_address);

  // await nativeSwap_poly.setTrustedRemoteAddress(BigNumber.from(10102), nativeSwap_bsc_address);


  await nativeSwap_poly.connect(userSigner).swap(receiverSigner.address, ethers.utils.parseEther("600000000"), {
value: ethers.utils.parseEther("0.7")
  })

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});