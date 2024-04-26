// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract Domains {
    // ドメイン登録者マップ
    mapping(string => address) public domains;

    // ドメインコンテンツマップ
    mapping(string => string) public records;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    // calldataは一時的で不変（memoryは一時的で可変）ガスが一番安い
    function register(string calldata name) public {
        // そのドメインがまだ登録されていないか確認します。
        require(domains[name] == address(0));
        domains[name] = msg.sender;
        console.log("%s has registered a domain!", msg.sender);
    }

    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    function setRecord(string calldata name, string calldata record) public {
        // トランザクションの送信者であることを確認しています。
        require(domains[name] == msg.sender);
        records[name] = record;
    }

    function getRecord(string calldata name) public view returns (string memory) {
        return records[name];
    }
}