//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Hms is ERC20 {
    constructor() ERC20("Hms Token", "HMS") {
        _mint(msg.sender, 1000000 * (10 ** 18));
    }
}