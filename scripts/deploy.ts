import {ethers} from "hardhat";
import {IUniswapV2Factory, IUniswapV2Router02, LiquidityValueCalculator__factory, UniswapV2Router02__factory, WEuro__factory, WRub__factory} from "../typechain-types";

import * as UniswapV2Factory from "@uniswap/v2-core/build/UniswapV2Factory.json";
import * as UniswapV2Router02 from "@uniswap/v2-periphery/build/UniswapV2Router02.json";


async function main() {
  const [owner, user1, user2] = await ethers.getSigners();

  const weuroFactory = new WEuro__factory(owner);
  const weuroToken = await weuroFactory.deploy(ethers.parseEther("1000000"));
  await weuroToken.waitForDeployment();

  const wrubFactory = new WRub__factory(owner);
  const wrubToken = await wrubFactory.deploy(ethers.parseEther("1000000"));
  await wrubToken.waitForDeployment();

  const wethFactory = new WEuro__factory(owner);
  const wethToken = await wethFactory.deploy(ethers.parseEther("1000000"));
  await wethToken.waitForDeployment();

  const uniswapFactory = await ethers.getContractFactory(UniswapV2Factory.abi, UniswapV2Factory.bytecode, owner);
  const uniswapToken = await uniswapFactory.deploy(owner) as IUniswapV2Factory;
  await uniswapToken.waitForDeployment();

  const uniswapFactroyRouter = await ethers.getContractFactory(UniswapV2Router02.abi, UniswapV2Router02.bytecode, owner);
  const uniswapRouterToken = await uniswapFactroyRouter.deploy(uniswapToken, wethToken) as IUniswapV2Router02;
  await uniswapRouterToken.waitForDeployment();

  const liquidityFactory = new LiquidityValueCalculator__factory(owner);
  const liquidityValueCalculatorToken = await liquidityFactory.deploy(uniswapToken);
  await liquidityValueCalculatorToken.waitForDeployment();

  console.log(
    `WEURO deployed to ${weuroToken.target}`
  );

  console.log(
    `WRUB deployed to ${wrubToken.target}`
  );

  console.log(
    `WETH deployed to ${wethToken.target}`
  );

  console.log(
    `UNIFactory deployed to ${uniswapToken.target}`
  );

  console.log(
    `UNIRouter deployed to ${uniswapRouterToken.target}`
  );

  return {owner, wethToken, uniswapToken}
};

//@ts-ignore
async function deployRouter({owner, wethToken, uniswapToken}) {

  const uniswapFactroyRouter = new UniswapV2Router02__factory(owner);
  const uniswapRouterToken = await uniswapFactroyRouter.deploy(uniswapToken.target, wethToken.target) as IUniswapV2Router02;
  await uniswapRouterToken.waitForDeployment();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
