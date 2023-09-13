import {task} from "hardhat/config";
import {WRub__factory} from "../typechain-types";

task("addLiquidity", "Add liquidity for pair")
  .addParam("account", "account")
  .addParam("contract", "AddLiquidity contract")
  .addParam("tokenA", "tokenA address")
  .addParam("tokenAamount", "Amount of tokenA to approve", "3000000000000000000")
  .addParam("tokenB", "tokenB address")
  .addParam("tokenBamount", "Amount of tokenB to approve", "3000000000000000000")
  .setAction(async ({account, contract, tokenA, tokenB, tokenAamount, tokenBamount}, {ethers}) => {
    const signer = await ethers.getSigner(account);

    const _tokenA = await ethers.getContractAt(WRub__factory.abi as any, tokenA, signer);
    const _tokenB = await ethers.getContractAt(WRub__factory.abi as any, tokenB, signer);
    
    const AddLiaquidity = await ethers.getContractAt("AddLiquidity", contract);

    let tx;
    tx = await tokenA.connect(signer).approve(AddLiaquidity, tokenAamount);
    await tx.wait();

    tx = await tokenB.connect(signer).approve(AddLiaquidity, tokenBamount);
    await tx.wait();


    tx = await AddLiaquidity.connect(signer).addLiquidity(_tokenA, _tokenB, tokenAamount, tokenBamount);
    const txRcpt = await tx.wait();

    console.log('--txResp--', txRcpt);
  })