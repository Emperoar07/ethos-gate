// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract EthosGateEscrow {
    address public owner;
    mapping(address => uint256) public deposits;

    constructor() {
        owner = msg.sender;
    }

    function pay() external payable {
        require(msg.value > 0, "Must send value");
        deposits[msg.sender] += msg.value;
    }

    function hasPaid(address user) external view returns (bool) {
        return deposits[user] > 0;
    }

    function withdraw() external {
        require(msg.sender == owner, "Not allowed");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}
