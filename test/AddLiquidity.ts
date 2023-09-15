import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

import * as UniswapV2Factory from "@uniswap/v2-core/build/UniswapV2Factory.json";
import * as UniswapV2Router02 from "@uniswap/v2-periphery/build/UniswapV2Router02.json";

import {AddLiquidity__factory, IUniswapV2Factory, IUniswapV2Router02, WEth__factory, WEuro__factory, WRub__factory} from "../typechain-types";

describe("AddLiaquidity contract", async () => {
    async function deployFixture() {
        const [owner, user1, user2] = await ethers.getSigners();
        const eth = ethers.parseEther("1");

        const weuroFactory = new WEuro__factory(owner);
        const weuroToken = await weuroFactory.deploy(ethers.parseEther("1000000"));
        await weuroToken.waitForDeployment();

        const wrubFactory = new WRub__factory(owner);
        const wrubToken = await wrubFactory.deploy(ethers.parseEther("1000000"));
        await wrubToken.waitForDeployment();

        const wethFactory = new WEth__factory(owner);
        const wethToken = await wethFactory.deploy(ethers.parseEther("1000000"));
        await wethToken.waitForDeployment();

        const uniswapFactory = await ethers.getContractFactory(UniswapV2Factory.abi, UniswapV2Factory.bytecode, owner);
        const uniswapToken = await uniswapFactory.deploy(owner) as IUniswapV2Factory;
        await uniswapToken.waitForDeployment();

        const uniswapFactroyRouter = await ethers.getContractFactory(UniswapV2Router02.abi, UniswapV2Router02.bytecode, owner);
        const uniswapRouterToken = await uniswapFactroyRouter.deploy(uniswapToken, wethToken) as IUniswapV2Router02;
        await uniswapRouterToken.waitForDeployment();

        const liquidityFactory = new AddLiquidity__factory(owner);
        const liquidityContract = await liquidityFactory.deploy(uniswapRouterToken, uniswapToken);
        await liquidityContract.waitForDeployment();

        let tx = await weuroToken.transfer(user1, 10n * eth);
        await tx.wait();
        tx = await wrubToken.transfer(user1, 10n * eth);
        await tx.wait();

        tx = await weuroToken.connect(user1).approve(liquidityContract, 10n * eth)
        await tx.wait()

        tx = await wrubToken.connect(user1).approve(liquidityContract, 10n * eth)
        await tx.wait()

        return {owner, user1, user2, weuroToken, wrubToken, uniswapToken, liquidityContract, wethToken, uniswapRouterToken}
    }

    it("Should emit 'AddedLiquidity' event", async () => {
        const {owner, user1, user2, weuroToken, wrubToken, uniswapToken, liquidityContract, wethToken, uniswapRouterToken} = await loadFixture(deployFixture);
        const eth = ethers.parseEther("1");
        const bA = await weuroToken.balanceOf(user1);
        const bB = await wrubToken.balanceOf(user1);

        await expect(liquidityContract.connect(user1).addLiquidity(weuroToken, wrubToken, 3n * eth, 3n * eth)).to.emit(liquidityContract, "AddedLiquidity");
    })

    it("Should change balances of tokens", async () => {
        const {owner, user1, user2, weuroToken, wrubToken, uniswapToken, liquidityContract, wethToken, uniswapRouterToken} = await loadFixture(deployFixture);
        const eth = ethers.parseEther("1");

        const balanceAbefore = await weuroToken.balanceOf(user1);
        const balanceBbefore = await wrubToken.balanceOf(user1);

        const tx = await liquidityContract.connect(user1).addLiquidity(weuroToken, wrubToken, 2n * eth, 3n * eth);
        const txRcpt = await tx.wait();


        const event = txRcpt?.logs.find(event => (event as InstanceType<typeof ethers.EventLog>).eventName === 'AddedLiquidity') as InstanceType<typeof ethers.EventLog> | undefined;

        const balanceAafter = await weuroToken.balanceOf(user1);
        const balanceBafter = await wrubToken.balanceOf(user1);

        expect(balanceAbefore - balanceAafter).to.eq(event?.args[4]);
        expect(balanceBbefore - balanceBafter).to.eq(event?.args[5]);

    })

    it("Should have allowance more than amount for contract", async () => {
        const {owner, user1, user2, weuroToken, wrubToken, uniswapToken, liquidityContract, wethToken, uniswapRouterToken} = await loadFixture(deployFixture);
        const eth = ethers.parseEther("1");

        await expect(liquidityContract.connect(user1).addLiquidity(weuroToken, wrubToken, 11n * eth, 3n * eth)).to.revertedWith("Insufficient allowance for contract 'AddLiquidity'");

        await expect(liquidityContract.connect(user1).addLiquidity(weuroToken, wrubToken, 1n * eth, 13n * eth)).to.revertedWith("Insufficient allowance for contract 'AddLiquidity'");
    })
})  