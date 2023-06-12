import { useState } from 'react'
import { ethers, BigNumber } from 'ethers'
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import Test from './Test.json' //modify
import merkletree from './Merkletree.js'
import { useUser, useConnectionStatus, useWallet } from '@thirdweb-dev/react'

window.Buffer = window.Buffer || require('buffer').Buffer

//var Buffer = require('buffer/').Buffer
//const Buffer = require("buffer").Buffer;
//contract address after launched
const RedLineCollectiveNFTAddress = '0x39160c05195c6Bc71202Be783B06545F42Fb1b33'

const MainMint = ({ accounts, setAccounts }) => {
    const { user, isLoading, isLoggedIn } = useUser()
    const [mintAmount, setMintAmount] = useState(1)
    const isConnected = Boolean(accounts[0])
    const connectionStatus = useConnectionStatus()
    const walletInstance = useWallet()

    console.log('user', user)
    console.log(user, isLoading, isLoggedIn, 'useuser')
    console.log('connectionStatus', connectionStatus)
    console.log('wallet', walletInstance)

    //https://blog.valist.io/how-to-connect-web3-js-to-metamask-in-2020-fee2b2edf58a
    async function handleMint() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                RedLineCollectiveNFTAddress,
                Test.abi, //need to change
                signer
            )
            console.log('test contract works')

            try {
                // need to get allowance and proof from merkletree.js
                //implement snippet from chance here to check assertions is true with merkle root() =>
                //IMPORTANT!! verification with set merkle root is done in smart contract
                console.log(merkletree.mintProof)
                console.log('Big')
                console.log(BigNumber.from(mintAmount))
                console.log(signer)

                //const gasPrice = signer.gasPrice();

                //const gasLimit = contract.estimateGas.allowlistMintAlternative(4,4,merkletree.mintProof[3]);
                const responseLeaf = await contract.getleaf(4)

                const response = await contract.allowlistMintAlternative(
                    BigNumber.from(2),
                    BigNumber.from(4),
                    merkletree.mintProof[3],
                    {
                        gasLimit: 2000000,
                        value: 2000000000000,
                    }
                )

                console.log('leaf; ', responseLeaf)
                console.log('front end leaf; ', merkletree.mintLeaf)

                console.log('front end proof; ', merkletree.mintProof)
                console.log('response; ', response)
            } catch (err) {
                console.log('error', err)
            }
        }
    }

    const handleDecrement = () => {
        if (mintAmount <= 1) return
        setMintAmount(mintAmount - 1)
    }

    const handleIncrement = () => {
        if (mintAmount >= 5) return
        setMintAmount(mintAmount + 1)
    }

    // if(!walletInstance){
    //     return <p>There's no wallet</p>
    // }

    return (
        <Flex
            justify="center"
            align="center"
            height="100vh"
            paddingBottom="150px"
        >
            <Box width="520px">
                <div>
                    <Text fontSize="48px" textShadow="0 5px #000000">
                        Redline Collective
                    </Text>
                    <Text
                        fontSize="30px"
                        letterSpacing="-5.5%"
                        fontFamily="Bebas Neue"
                        textShadow="0 2px 2px #000000"
                    ></Text>
                </div>

                {walletInstance ? (
                    <div>
                        <Flex align="center" justify="center">
                            <Button
                                backgroundColor="#000000"
                                borderRadius="5px"
                                boxShadow="0px 2px 2px 1px #0F0F0F"
                                color="white"
                                cursor="pointer"
                                fontFamily="Bebas Neue"
                                padding="15px"
                                marginTop="10"
                                onClick={handleDecrement}
                            >
                                {' '}
                                -
                            </Button>
                            <Input
                                readOnly
                                fontFamily="Bebas Neue"
                                width="100px"
                                height="40px"
                                textAlign="center"
                                paddingLeft="19px"
                                marginTop="10px"
                                type="number"
                                value={mintAmount}
                            />

                            <Button
                                backgroundColor="#000000"
                                borderRadius="5px"
                                boxShadow="0px 2px 2px 1px #0F0F0F"
                                color="white"
                                cursor="pointer"
                                fontFamily="Bebas Neue"
                                padding="15px"
                                marginTop="10"
                                onClick={handleIncrement}
                            >
                                {' '}
                                +
                            </Button>
                        </Flex>

                        <Button
                            backgroundColor="#000000"
                            borderRadius="5px"
                            boxShadow="0px 2px 2px 1px #0F0F0F"
                            color="white"
                            cursor="pointer"
                            fontFamily="Bebas Neue"
                            padding="15px"
                            marginTop="10"
                            onClick={handleMint}
                        >
                            Mint Now
                        </Button>
                    </div>
                ) : (
                    <Text
                        marginTop="70px"
                        fontSize="25px"
                        letterSpacing="-5.5%"
                        fontFamily="Bebas Neue"
                        textShadow="0 3px #000000"
                        color="#D3D3D3"
                    >
                        {!walletInstance
                            ? 'No wallet connected'
                            : 'The other text'}
                    </Text>
                )}
            </Box>
        </Flex>
    )
}

export default MainMint
