import {ethers, network} from "hardhat";
import {AddLiquidity__factory, IUniswapV2Factory, IUniswapV2Router02, WEth__factory, WEuro__factory, WRub__factory} from "../typechain-types";

import * as UniswapV2Factory from "@uniswap/v2-core/build/UniswapV2Factory.json";
import * as UniswapV2Router02 from "@uniswap/v2-periphery/build/UniswapV2Router02.json";


async function main() {
  const weuroFactory = new WEuro__factory();
  const weuroToken = await weuroFactory.deploy(ethers.parseEther("1000000"));
  await weuroToken.waitForDeployment();

  const wrubFactory = new WRub__factory();
  const wrubToken = await wrubFactory.deploy(ethers.parseEther("1000000"));
  console.log('Waiting for confirmation WRUB...');  
  await wrubToken.waitForDeployment();
  console.log('WRUB was deployed: ' + wrubToken.target);

  let uniswapTokenAddr = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", uniswapRouterTokenAddr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  let wethToken;

  if (['localhost', 'hardhat'].includes(network.name)) {

    const wethFactory = new WEth__factory();
    wethToken = await wethFactory.deploy(ethers.parseEther("1000000"));
    await wethToken.waitForDeployment();

    const uniswapFactory = await ethers.getContractFactory(UniswapV2Factory.abi, UniswapV2Factory.bytecode);
    const uniswapToken = await uniswapFactory.deploy() as IUniswapV2Factory;
    uniswapTokenAddr = uniswapToken.target as string;
    await uniswapToken.waitForDeployment();

    const uniswapFactroyRouter = await ethers.getContractFactory(UniswapV2Router02.abi, UniswapV2Router02.bytecode);
    const uniswapRouterToken = await uniswapFactroyRouter.deploy(uniswapToken, wethToken) as IUniswapV2Router02;
    uniswapRouterTokenAddr = uniswapRouterToken.target as string;
    await uniswapRouterToken.waitForDeployment();
  }

  const liquidityFactory = new AddLiquidity__factory();
  const liquidityContract = await liquidityFactory.deploy(uniswapRouterTokenAddr, uniswapTokenAddr);
  console.log('Waiting for confirmation AddLiquidity...');  
  await liquidityContract.waitForDeployment();
  console.log('AddLiquidity contract was deployed:' + liquidityContract.target)

  if (['localhost', 'hardhat'].includes(network.name)) {

    console.log(
      `UNIFactory deployed to ${uniswapTokenAddr}`
    );

    console.log(
      `UNIRouter deployed to ${uniswapRouterTokenAddr}`
    );
  }
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
