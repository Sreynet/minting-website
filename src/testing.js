const Test = require('./Test.json')
const ethers = require('ethers')

const RedLineCollectiveNFTAddress = '0x01AB7B02A6fc88B0863C387907091beAb262d437'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const contract = new ethers.Contract(
    RedLineCollectiveNFTAddress,
    Test.abi,
    signer
)

console.log(contract.methods.name().call())
