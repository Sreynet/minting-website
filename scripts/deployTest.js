// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat')

async function main() {
    const Test = await hre.ethers.getContractFactory('Test')
    const test = await Test.deploy(
        '0xa5409ec958C83C3f309868babACA7c86DCB077c1',
        '0x7b1f3a3009D6174EFAAab0aA1b4CF7F997680742',
        'https://bronze-changing-booby-153.mypinata.cloud/ipfs/QmeSoU8eVaPzzcCuHxkrmFEQ6Q1cuB8mTWpHuB5yWyL4FQ/hidden_json.json'
    )

    await test.deployed()

    console.log('Test deployed to: ', test.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
