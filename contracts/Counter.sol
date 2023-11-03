//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.21;
pragma abicoder v2;

import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";

contract Counter is NonblockingLzApp {
    bytes public constant PAYLOAD = "\x01\x02\x03\x04";
    uint public counter;

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {}

    function _nonblockingLzReceive(
        uint16,
        bytes memory,
        uint64,
        bytes memory
    ) internal override {
        counter += 1;
    }

    function incrementCounter(uint16 _dstChainId) public payable {
        _lzSend(_dstChainId, PAYLOAD, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }


}