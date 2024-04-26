// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.18;

import {StringUtils} from "./libraries/StringUtils.sol";
import "hardhat/console.sol";

contract Domains {
    // トップレベルドメイン(TLD)
    string public tld;

    // ドメイン登録者マップ
    mapping(string => address) public domains;

    // ドメインコンテンツマップ
    mapping(string => string) public records;

    constructor(string memory _tld) payable {
        tld = _tld;
        console.log("%s name service deployed", _tld);
    }

    // 価格算出: ただの計算ロジックなのでpure
    function price(string calldata name) public pure returns (uint) {
        uint len = StringUtils.strlen(name);
        require(len > 0);
        if (len == 3) {
            return 0.0000005 * 10 ** 18;
        } else if (len == 4) {
            return 0.0000003 * 10 ** 18;
        } else {
            return 0.0000001 * 10 ** 18;
        }
    }

    // calldataは一時的で不変（memoryは一時的で可変）ガスが一番安い
    function register(string calldata name) public payable {
        // そのドメインがまだ登録されていないか確認します。
        require(domains[name] == address(0));
        uint _price = price(name);
        require(msg.value >= _price, "Not enough Matic paid");
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