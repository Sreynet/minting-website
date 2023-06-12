const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const ethers = require('ethers')
window.Buffer = window.Buffer || require('buffer').Buffer

//PLAN: REPLICATE WHAT IS GOING ON IN THE SMART CONTRACT HERE SO IT WORKS

// !!!!!!!! NEED TO GET PROOF FOR EACH ADDRESS !!!!!!!
//Psuedocode :
// For address
// mintLeaf = initial hashAllowlistToken( address)
//var mintProof = allowListTree.getHexProof(mintLeaf);
//return proof to front end

//TO VERIFY YOU NEED :
// 1) PROOF
// 2) MERKLEROOT
// 3) LEAF

//TO MINT FROM ALLOW LIST :
// 1) MINT AMOUNT
// 2) ALLOWANCE
// 3) PROOF

let allowListAddresses = [
    {
        address: '0x8cb9431fE8088405346Fa42C62Ca3C86f75396c1',
        quantity: 1,
    },
    {
        address: '0x21a9c5c758E757FA018Fe72363EE56ed1AFdDab8',
        quantity: 2,
    },
    {
        address: '0xcD63Ed58D5A68eD8EF8868a97d75e2bF4a6161EE',
        quantity: 3,
    },
    {
        address: '0xE58C107D78D1AE5DCE7Ca9cb0152Bb412C75Ff0d',
        quantity: 4,
    },
]
/*
let allowListAddresses2 = [
    
    "0x8cb9431fE8088405346Fa42C62Ca3C86f75396c1",
    "0x21a9c5c758E757FA018Fe72363EE56ed1AFdDab8",
    "0xcD63Ed58D5A68eD8EF8868a97d75e2bF4a6161EE",
    "0xE58C107D78D1AE5DCE7Ca9cb0152Bb412C75Ff0d" 

]

const leafNodes = allowListAddresses2.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leadNodes, keccak256, {sortPairs: true});

const rootHash = merkleTree.getRoot();

console.log('Whitelist Merkle Tree ', merkleTree.toString());

const hexProof = merkleTree.getHexProof("0xE58C107D78D1AE5DCE7Ca9cb0152Bb412C75Ff0d")
*/
//HASHES THE ARRAY OF ALLOWLIST ADDRESSES AND ALLOWANCE FOR NFTS

function initialHashAllowlistToken(mintingAddress, allowance) {
    //console.log(" Checking input for address and allowance: ", mintingAddress, " ", allowance)
    //console.log(" Testing slice: ", (ethers.utils.solidityKeccak256(['address', 'string'], [mintingAddress, allowance]).slice(2)))
    //console.log(" Testing without slice: ", (ethers.utils.solidityKeccak256(['address', 'string'], [mintingAddress, allowance])))
    var test = Buffer.from(
        ethers.utils
            .solidityKeccak256(
                ['address', 'uint256'],
                [mintingAddress, allowance]
            )
            .slice(2),
        'hex'
    )
    //console.log(" Testing return value for initialHashAllowlistToken: ", test)
    var sol = ethers.utils
        .solidityPack(['address', 'string'], [mintingAddress, allowance])
        .slice(2)
    var hashSol = Buffer.from(keccak256(sol), 'hex')
    //console.log("hashSol: ", hashSol)
    //console.log("test: ", test)
    //var testing = Buffer.from(ethers.utils.solidityKeccak256(ethers.utils.solidityPack(['address', 'string'], [mintingAddress, allowance]).slice(2)), 'hex')
    //console.log(test)
    //var test2 = Buffer.from(test, 'hex')
    //console.log(test2)
    //var abi = ethers.utils.defaultAbiCoder.encode(['address', 'uint256'], [mintingAddress, allowance])
    //console.log(abi);
    //console.log(Buffer.from(ethers.utils.solidityKeccak256(abi)));
    return test
    //return Buffer.from(ethers.utils.solidityKeccak256(abi, 'hex')); //hex returns 'hex' not hash
}
/*
function computeKeccak256(payload, allowance) {
  // Convert payload and allowance to hexadecimal representation
  const payloadHex = ethers.utils.hexlify(payload);
  const allowanceHex = ethers.utils.hexlify(allowance);

  //console.log(payloadHex)
  //console.log(allowanceHex)

  // Concatenate the hexadecimal representations of payload and allowance
  const concatenatedHex = ethers.utils.concat([payloadHex, allowanceHex]);
  //console.log(concatenatedHex)

  // Compute the keccak256 hash of the concatenated hexadecimal data
  const keccak256Hash = ethers.utils.keccak256(concatenatedHex);
  //console.log(keccak256)

  //console.log(Buffer.from(keccak256Hash), 'hex')

  
  // Return the keccak256 hash as a hexadecimal string
  return(keccak256Hash);
}
*/

//creates leaves by mapping it with hash of address
const allowListLeaves = allowListAddresses.map((token) =>
    ethers.utils.solidityKeccak256(
        ['address', 'uint256'],
        [token.address, token.quantity]
    )
)
console.log('Printing allowListTree leaves: ', allowListLeaves)
//CREATES ALLOWLIST MERKLE TREE WITH ALLOW LIST LEAVES THAT ARE HASHED
const allowListTree = new MerkleTree(allowListLeaves, keccak256, {
    sortPairs: true,
})
console.log(
    'Printing allowListTree from new MerkleTree: ',
    allowListTree.toString()
)

//GETS HEX ROOT
const rootHash = allowListTree.getHexRoot()
console.log('Printing rootHash: ', rootHash)

//FOR TESTING PURPOSES

//console.log("first test")
//var mintLeaf2 = ( computeKeccak256 ("0xE58C107D78D1AE5DCE7Ca9cb0152Bb412C75Ff0d", 4));
//console.log("mintLeaf2")
//console.log(mintLeaf2)

var mintLeaf = ethers.utils.solidityKeccak256(
    ['address', 'uint256'],
    ['0xE58C107D78D1AE5DCE7Ca9cb0152Bb412C75Ff0d', 4]
)
console.log('Printing out mintLeaf from initialHashAllowlistToken: ', mintLeaf)
/*
console.log("test compare start")
console.log(mintLeaf)
console.log("test compare")
console.log(mintLeaf2)
*/
//'getHexProof' return required neighborhood nodes and parent nodes to get back the merkle root
const mintProof = allowListLeaves.map((leaf) => allowListTree.getHexProof(leaf))
console.log('Printing out Mint Proof: ', mintProof)
//console.log("Printing out Mint Proof: ", allowListTree.getHexProof(mintLeaf));

console.log('Printing out Mint Proof for address: ', mintProof[3])

console.log(
    allowListTree.verify(mintProof[3], mintLeaf, allowListTree.getHexRoot())
)

//var allowlistMerkleRoot = 0xb7f2eec0444b43af018897473c8996fc006169994a3d35936f849c51964b094e
//if (merkleProof.verify(proof, allowlistMerkleRoot, mintLeaf)) {
//console.log('PASSED');
//};

//

export default { mintProof, mintLeaf }
