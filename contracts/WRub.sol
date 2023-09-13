// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6 <=0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WRub is ERC20 {
    constructor(uint256 initialSupply) ERC20("Wrapped rubble", "WRUB") {
        _mint(msg.sender, initialSupply);
    }
}