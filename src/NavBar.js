import { easeIn } from 'framer-motion'
import React from 'react'
import { Box, Button, Flex, Image, Link, Spacer } from '@chakra-ui/react'
import Instagram from './assets/social-media-icons/icons8-instagram.png'
import Twitter from './assets/social-media-icons/icons8-twitter.png'
import Discord from './assets/social-media-icons/icons8-discord.png' //change to discord
const Web3 = require('web3')

/*

  const isConnected = Boolean(accounts[0]);
  async function connectAccount(){ //NEED TO MAKE SURE ON MAINNET
    if(window.ethereum) {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

    setAccounts(accounts);
    }
}
*/
const NavBar = ({ accounts, setAccounts }) => {
    return (
        <Flex justify="space-between" align="center" padding="10px">
            {/* Left side */}
            <Flex justify="space-around" width="25%" padding="0 75px">
                <Link href="https://www.instagram.com">
                    <Image src={Instagram} boxsize="42px" margin="0 15px" />
                </Link>
                <Link href="https://www.twitter.com">
                    <Image src={Twitter} boxsize="42px" margin="0 15px" />
                </Link>
                <Link href="https://www.discord.com">
                    <Image src={Discord} boxsize="42px" margin="0 15px" />
                </Link>
            </Flex>
        </Flex>
    )
}
export default NavBar

/*
     <Flex 
            justify ="space-around"
            align="center"
            width="40%"
            padding="30px"
        >
        
          
            {isConnected ? (
                <Box margin="0 15px">Connected</Box>
            ) : (
                <Button 
                    backgroundColor="#000000"
                    borderRadius="5px"
                    boxShadow="0px 2px 2px 1px #0F0F0F"
                    color="white"
                    cursor="pointer"
                    fontFamily="Bebas Neue"
                    padding="10px"
                    margin="0 15px"
                    onClick={connectAccount}
    
                >
                    Connect
                    </Button>
            )}
    
            </Flex>
*/
//  { /* Connect */}
