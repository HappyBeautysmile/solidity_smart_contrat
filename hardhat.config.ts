import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-web3";

const config: HardhatUserConfig = {
  solidity: "0.8.13",
};

export default config;
