require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("dotenv/config");

const { task } = require("hardhat/config");
const { snapshot } = require("./tasks/snapshot");

let ethers = require("ethers");

task("snapshot", "Snapshot")
  .addParam("address", "The contract address")
  .addParam("block", "The blocknumber to fork")
  .setAction(async (taskArgs, hre) => {
    console.log("🚀 | .setAction | taskArgs", taskArgs);
    console.log("Snapshotting...");
    await snapshot(taskArgs.address);
  });

function checkSetup(envVariable) {
  if (!process.env[envVariable]) {
    console.log(`⚠️ Please set ${envVariable} in the .env file`);
  }
}
// Check Setup Default Values
checkSetup("ALCHEMY_RPC");
checkSetup("FOLDER_ID");
checkSetup("BLOCK_NUMBER");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      saveDeployments: true,
    },
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_RPC,
        blockNumber: Number(process.env.BLOCK_NUMBER),
      },
      mining: {
        auto: true,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./deploy",
  },
};
