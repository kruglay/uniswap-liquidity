// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.6 <=0.8.19;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

import "./interfaces/IAddLiquidity.sol";

contract AddLiquidity is IAddLiquidity {

  string public constant name = "AddLiquidityToUniswapV2";
  IUniswapV2Router02 public immutable uniRouter;
  IUniswapV2Factory public immutable uniFactory;

  constructor(IUniswapV2Router02 _router, IUniswapV2Factory _factory) {
    uniRouter = IUniswapV2Router02(_router);
    uniFactory = IUniswapV2Factory(_factory);
  }

  function addLiquidity(
    address tokenA,
    address tokenB,
    uint256 amountA,
    uint256 amountB
  ) external {
    IERC20 _tokenA = IERC20(tokenA);
    IERC20 _tokenB = IERC20(tokenB);

    require(
      _tokenA.allowance(msg.sender, address(this)) >= amountA &&
        _tokenB.allowance(msg.sender, address(this)) >= amountB,
      "Insufficient allowance for contract 'AddLiquidity'"
    );
    
    _tokenA.transferFrom(msg.sender, address(this), amountA);
    _tokenB.transferFrom(msg.sender, address(this), amountB);

    if (_tokenA.allowance(msg.sender, address(uniRouter)) < amountA) {
      _tokenA.approve(address(uniRouter), amountA);
    }
    if (_tokenB.allowance(msg.sender, address(uniRouter)) < amountB) {
      _tokenB.approve(address(uniRouter), amountB);
    }

    address pair = address(
      uint160(
        uint(
          keccak256(
            abi.encodePacked(
              bytes1(0xff),
              uniFactory,
              keccak256(abi.encodePacked(tokenA, tokenB)),
              bytes32(
                0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f
              )
            )
          )
        )
      )
    );

    (uint256 amountAddedA, uint256 amountAddedB, uint256 liquidity) = uniRouter
      .addLiquidity(
        tokenA,
        tokenB,
        amountA,
        amountB,
        amountA - amountA/100,
        amountB - amountB/100,
        msg.sender,
        block.timestamp + 3600
      );

    emit AddedLiquidity(tokenA, tokenB, msg.sender, pair, amountAddedA, amountAddedB, liquidity);
  }

  function test() external view returns(address sender) {
    sender = msg.sender;
  }
}
