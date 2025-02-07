import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "DecentralizedEnergyCommunity" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployDecentralizedEnergyCommunity: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get the address of the EURC token to be used by the contract. If not defined, use the Ethereum Sepolia address
  const eurcAddress = process.env.EURC_ADDRESS ?? "0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4";

  await deploy("DecentralizedEnergyCommunity", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer, eurcAddress],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const decentralizedEnergyCommunity = await hre.ethers.getContract<Contract>("DecentralizedEnergyCommunity", deployer);
  console.log("👋 Current cummunity Id:", await decentralizedEnergyCommunity.communityIds());
};

export default deployDecentralizedEnergyCommunity;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployDecentralizedEnergyCommunity.tags = ["DecentralizedEnergyCommunity"];
