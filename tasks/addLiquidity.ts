import {task} from "hardhat/config";
import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";

task("addLiquidity", "Add liquidity for pair")
  .addParam("account", "account")
  .addParam("contract", "AddLiquidity contract")
  .addParam("tokenA", "tokenA address")
  .addParam("tokenAAmount", "Amount of tokenA to approve", "3000000000000000000")
  .addParam("tokenB", "tokenB address")
  .addParam("tokenBAmount", "Amount of tokenB to approve", "3000000000000000000")
  .setAction(async ({account, contract, tokenA, tokenB, tokenAAmount, tokenBAmount}, {ethers}) => {
    const signer = await ethers.getSigner(account);

    const _tokenA = await ethers.getContractAt(ERC20.abi as any, tokenA, signer);
    const _tokenB = await ethers.getContractAt(ERC20.abi as any, tokenB, signer);
    
    const AddLiaquidity = await ethers.getContractAt("AddLiquidity", contract, signer);
    console.dir(_tokenA, {depth: 3});

    let tx;
    tx = await _tokenA.approve(AddLiaquidity, tokenAAmount);
    await tx.wait();

    tx = await _tokenB.approve(AddLiaquidity, tokenBAmount);
    await tx.wait();


    tx = await AddLiaquidity.addLiquidity(_tokenA, _tokenB, tokenAAmount, tokenBAmount);
    const txRcpt = await tx.wait();

    console.log('--txResp--', txRcpt);
  })