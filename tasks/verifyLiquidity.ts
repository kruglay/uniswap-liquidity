import {task} from "hardhat/config";

task("verifyLiquidity", "Verify contract")
.addParam('contract')
.setAction(async ({contract}, {run}) => {
  const uniswapTokenAddr = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", uniswapRouterTokenAddr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  console.log('Notifying contract...');
  await run('verify:verify', {
    address: contract,
    constructorArguments: [
      uniswapRouterTokenAddr, 
      uniswapTokenAddr
    ]
  });
  console.log('Verification success!');
})