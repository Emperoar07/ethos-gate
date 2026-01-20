import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("ReputationPayments", function () {
  let contract: any;
  let mockUSDC: any;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let treasury: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2, treasury] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("USD Coin", "USDC", 6);
    await mockUSDC.waitForDeployment();

    const ReputationPayments = await ethers.getContractFactory("ReputationPayments");
    contract = await ReputationPayments.deploy(await mockUSDC.getAddress(), treasury.address);
    await contract.waitForDeployment();

    await mockUSDC.mint(user1.address, ethers.parseUnits("1000", 6));
    await mockUSDC.mint(user2.address, ethers.parseUnits("1000", 6));
  });

  describe("Deployment", function () {
    it("sets the correct USDC address", async function () {
      expect(await contract.usdc()).to.equal(await mockUSDC.getAddress());
    });

    it("sets the correct treasury", async function () {
      expect(await contract.treasury()).to.equal(treasury.address);
    });

    it("sets the correct owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });
  });

  describe("Staking", function () {
    it("allows users to stake", async function () {
      const amount = ethers.parseUnits("100", 6);

      await mockUSDC.connect(user1).approve(await contract.getAddress(), amount);

      await expect(contract.connect(user1).stake(amount))
        .to.emit(contract, "Staked")
        .withArgs(user1.address, amount, anyValue);

      const stake = await contract.getStake(user1.address);
      expect(stake.amount).to.equal(amount);
      expect(stake.active).to.equal(true);
    });

    it("reverts if staking without approval", async function () {
      const amount = ethers.parseUnits("100", 6);
      await expect(contract.connect(user1).stake(amount)).to.be.reverted;
    });

    it("reverts on double staking", async function () {
      const amount = ethers.parseUnits("100", 6);

      await mockUSDC.connect(user1).approve(await contract.getAddress(), amount * 2n);
      await contract.connect(user1).stake(amount);

      await expect(contract.connect(user1).stake(amount)).to.be.revertedWith("Already have active stake");
    });

    it("allows withdrawing stake", async function () {
      const amount = ethers.parseUnits("100", 6);

      await mockUSDC.connect(user1).approve(await contract.getAddress(), amount);
      await contract.connect(user1).stake(amount);

      const balanceBefore = await mockUSDC.balanceOf(user1.address);

      await expect(contract.connect(user1).withdrawStake())
        .to.emit(contract, "StakeWithdrawn")
        .withArgs(user1.address, amount);

      const balanceAfter = await mockUSDC.balanceOf(user1.address);
      expect(balanceAfter - balanceBefore).to.equal(amount);

      const stake = await contract.getStake(user1.address);
      expect(stake.active).to.equal(false);
    });

    it("allows owner to slash stake", async function () {
      const amount = ethers.parseUnits("100", 6);

      await mockUSDC.connect(user1).approve(await contract.getAddress(), amount);
      await contract.connect(user1).stake(amount);

      await expect(contract.connect(owner).slashStake(user1.address))
        .to.emit(contract, "StakeSlashed")
        .withArgs(user1.address, amount);

      expect(await mockUSDC.balanceOf(treasury.address)).to.equal(amount);
    });
  });

  describe("Payments", function () {
    it("creates payment", async function () {
      const amount = ethers.parseUnits("50", 6);

      await mockUSDC.connect(user1).approve(await contract.getAddress(), amount);

      await expect(contract.connect(user1).createPayment(user2.address, amount))
        .to.emit(contract, "PaymentCreated")
        .withArgs(0, user1.address, user2.address, amount);

      const payment = await contract.getPayment(0);
      expect(payment.payer).to.equal(user1.address);
      expect(payment.recipient).to.equal(user2.address);
      expect(payment.amount).to.equal(amount);
      expect(payment.status).to.equal(0);
    });

    it("completes payment", async function () {
      const amount = ethers.parseUnits("50", 6);

      await mockUSDC.connect(user1).approve(await contract.getAddress(), amount);
      await contract.connect(user1).createPayment(user2.address, amount);

      const balanceBefore = await mockUSDC.balanceOf(user2.address);

      await expect(contract.connect(user1).completePayment(0))
        .to.emit(contract, "PaymentCompleted")
        .withArgs(0);

      const balanceAfter = await mockUSDC.balanceOf(user2.address);
      expect(balanceAfter - balanceBefore).to.equal(amount);

      const payment = await contract.getPayment(0);
      expect(payment.status).to.equal(1);
    });

    it("refunds payment", async function () {
      const amount = ethers.parseUnits("50", 6);

      await mockUSDC.connect(user1).approve(await contract.getAddress(), amount);
      await contract.connect(user1).createPayment(user2.address, amount);

      const balanceBefore = await mockUSDC.balanceOf(user1.address);

      await expect(contract.connect(user1).refundPayment(0))
        .to.emit(contract, "PaymentRefunded")
        .withArgs(0);

      const balanceAfter = await mockUSDC.balanceOf(user1.address);
      expect(balanceAfter - balanceBefore).to.equal(amount);

      const payment = await contract.getPayment(0);
      expect(payment.status).to.equal(2);
    });

    it("allows owner to slash payment", async function () {
      const amount = ethers.parseUnits("50", 6);

      await mockUSDC.connect(user1).approve(await contract.getAddress(), amount);
      await contract.connect(user1).createPayment(user2.address, amount);

      await expect(contract.connect(owner).slashPayment(0))
        .to.emit(contract, "PaymentSlashed")
        .withArgs(0);

      expect(await mockUSDC.balanceOf(treasury.address)).to.equal(amount);
    });

    it("reverts for non-payer completion", async function () {
      const amount = ethers.parseUnits("50", 6);

      await mockUSDC.connect(user1).approve(await contract.getAddress(), amount);
      await contract.connect(user1).createPayment(user2.address, amount);

      await expect(contract.connect(user2).completePayment(0)).to.be.revertedWith("Only payer can complete");
    });
  });
});
