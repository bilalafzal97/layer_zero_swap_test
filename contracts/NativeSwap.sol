//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.21;
pragma abicoder v2;

import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";

contract NativeSwap is NonblockingLzApp {

// State variables for the contract
    uint16 public destChainId;
    bytes payload;
    address payable deployer;
    address payable contractAddress = payable(address(this));

    // Instance of the LayerZero endpoint
//    ILayerZeroEndpoint public immutable endpoint;

    constructor(address _lzEndpoint, uint16 _destChainId) NonblockingLzApp(_lzEndpoint) {
        deployer = payable(msg.sender);
//        endpoint = ILayerZeroEndpoint(_lzEndpoint);

        destChainId = _destChainId;
    }

    /**
     * @dev Allows users to swap to ETH.
     * @param Receiver Address of the receiver.
     */
    function swap(address Receiver, uint amount) public payable {
        uint value = msg.value;
//        contractAddress.transfer(amount);

        payload = abi.encode(Receiver, amount);

        _lzSend(destChainId, payload, payable(msg.sender), payable(msg.sender), bytes(""), value);
    }


    function _nonblockingLzReceive(uint16, bytes memory, uint64, bytes memory _payload) internal override {

        (address Receiver , uint Value) = abi.decode(_payload, (address, uint));
        address payable recipient = payable(Receiver);
        recipient.transfer(Value);
    }

//
//    function _nonblockingLzReceive(uint16 _srcChainId, bytes memory _srcAddress, uint64 _nonce, bytes memory _payload) internal override {
//
//        (address Receiver , uint Value) = abi.decode(_payload, (address, uint));
//        address payable recipient = payable(Receiver);
//        recipient.transfer(Value);
//    }

    // Fallback function to receive ether
    receive() external payable {}

    /**
     * @dev Allows the owner to withdraw all funds from the contract.
     */
    function withdrawAll() external onlyOwner {
        deployer.transfer(address(this).balance);
    }
}