require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-etherscan')
const dotenv = require('dotenv')

dotenv.config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    networks: {
        goerli: {
            url: process.env.REACT_APP_SEP_RPC_URL,
            accounts: [process.env.REACT_APP_PRIVATE_KEY],
        },
    },
    solidity: {
        compilers: [
            { version: '0.8.0' },
            {
                version: '0.8.6',
            },
            {
                version: '0.8.7',
            },
            {
                version: '0.8.10',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1000,
                    },
                },
            },
        ],
    },
    etherscan: {
        apiKey: process.env.REACT_APP_ETHERSCAN_KEY,
    },
}
