// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.6 <=0.8.19;

interface IAddLiquidity {
  event AddedLiquidity(address indexed tokenA, address indexed tokenB, address indexed creator, address LPpair, uint256 amountAddedA, uint256 amountAddedB, uint256 liquidity);

  function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external;
}