// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/*

*****************************************************************************
*****************************************************************************
*****************************************************************************
*****************************************************************************
*******      :::::::::       ::::::::             :::             ::: *******
*******     :+:    :+:     :+:    :+:           :+:             :+:   *******
*******    +:+    +:+     +:+                 +:+             +:+     *******
*******   +#++:++#:      +#+                +#+             +#+       *******
*******  +#+    +#+     +#+               +#+             +#+         *******
******* #+#    #+#     #+#    #+#       #+#             #+#           *******
****** ###    ###      ########       ###             ###             *******
*****************************************************************************
***************************************************************************** 
*****************************************************************************
*****************************************************************************

*/

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC721Enumerable.sol";

contract Test is ERC721URIStorage, ERC721Enumerable, Ownable { // change Test
    string  public              baseURI;
    string  public              unRevealedUri;
    
    address public              proxyRegistryAddress;
    address payable public      withdrawWallet; 

    bytes32 public              allowlistMerkleRoot;
    uint256 public              MAX_SUPPLY;

    uint256 public constant     MAX_PER_TX          = 6; //change *1 above 
    uint256 public constant     RESERVES            = 5; //change  *1 above 
    uint256 public constant     priceInWei          = 0.000001 ether; //change
    bool    public revealed                            = false;

    mapping(address => bool) public projectProxy;
    mapping(address => uint) public addressToMinted;
    mapping(uint256 => string) internal tokenToUri; //should this be internal or private

    constructor( 
        address _proxyRegistryAddress,
        address payable _withdrawWallet,
        string memory _unRevealedUri
      
    )
        ERC721("Test", "Test") //change
    {
        unRevealedUri = _unRevealedUri;
        proxyRegistryAddress = _proxyRegistryAddress;
        withdrawWallet = _withdrawWallet;
        
    }

    //setBaseURI sets the BaseURI 
    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    //add baseURI() function
    function _baseURI() internal view override(ERC721URIStorage) returns(string memory) {
        return baseURI;
    }

    //setBaseURI sets unrevealed BaseURI 
    function setUnrevealedURI(string memory _unrevealedURI) public onlyOwner {
        unRevealedUri = _unrevealedURI;
    }

    //setWithdrawWallet sets the wallet for withdrawal
    function setWithdrawWallet(address payable _withdrawWallet) external onlyOwner {
        withdrawWallet = _withdrawWallet;
    }

    //tokenURI sets the tokenURI for each token
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        if(revealed == false) {
        return unRevealedUri;
    }
        require(_exists(_tokenId), "Token does not exist.");
        return string(abi.encodePacked(baseURI, Strings.toString(_tokenId), ".json"));
    }

    //function SetTokenURI https://ethereum.stackexchange.com/questions/87853/updating-erc-721-tokens-metadata-after-it-was-minted

    //Set specified tokenID to new URI
    function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal virtual{
        require(_exists(_tokenId), "Token does not exist.");
        tokenToUri[_tokenId] = _tokenURI;
        

    }

    //setProxyRegistryAddress sets Proxy Registry Address 
    function setProxyRegistryAddress(address _proxyRegistryAddress) external onlyOwner {
        proxyRegistryAddress = _proxyRegistryAddress;
    }

    //flipProxyState resets Proxy state 
    function flipProxyState(address proxyAddress) public onlyOwner {
        projectProxy[proxyAddress] = !projectProxy[proxyAddress];
    }

    //collectReserves allows for owner of contract to collect reserved NFTs
    function collectReserves() external onlyOwner {
        require(_owners.length == 0, 'Reserves already taken.');
        for(uint256 i; i < RESERVES; i++)
            _mint(_msgSender(), i);
    }

    //setAllowlistMerkleRoot sets merkle root for the allowlist
    function setAllowlistMerkleRoot(bytes32 _allowlistMerkleRoot) external onlyOwner {
        allowlistMerkleRoot = _allowlistMerkleRoot;
    }

    //togglePublicSale opens public sale and sets max supply
    function togglePublicSale(uint256 _MAX_SUPPLY) external onlyOwner {
        delete allowlistMerkleRoot;
        MAX_SUPPLY = _MAX_SUPPLY;
    }

    //allowlistMint only allows addresses on allowlist to mint
    function allowlistMint (uint256 count, uint256 quantity, bytes32[] calldata proof) public payable{
        bytes32 node = keccak256(abi.encodePacked(msg.sender, quantity));
        require(MerkleProof.verify(proof, allowlistMerkleRoot, node), 'Invalid proof');
        require(addressToMinted[_msgSender()] + count <= quantity, "Exceeds whitelist supply"); 
        require(count * priceInWei == msg.value, "Invalid funds provided.");

        addressToMinted[_msgSender()] += count;
        uint256 totalSupply = _owners.length;
        for(uint i; i < count; i++) { 
            _mint(_msgSender(), totalSupply + i);
        }

    }

    //publicMint allows minting for public
    function publicMint(uint256 count) public payable {
        uint256 totalSupply = _owners.length;
        require(totalSupply + count < MAX_SUPPLY, "Excedes max supply.");  
        require(count < MAX_PER_TX, "Exceeds max per transaction.");
        require(count * priceInWei == msg.value, "Invalid funds provided.");
    
        for(uint i; i < count; i++) { 
            _mint(_msgSender(), totalSupply + i);
        }
    }

    //reveal toggles reveal to true
    function reveal() public onlyOwner {
      revealed = true;
    }
  
    //burn burns token
    function burn(uint256 tokenId) public { 
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not approved to burn.");
        _burn(tokenId);
    }

    //withdraw withdraws funds to the set wallet address
    function withdraw() public onlyOwner {
       (bool success, ) = withdrawWallet.call{value: address(this).balance}("");
        require(success, "Failed to send to WALLET ADDRESS.");
    }

    //walletOfOwner shows all of the nfts that a wallet owns
    function walletOfOwner(address _owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) return new uint256[](0);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for (uint256 i; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    //batchTransferFrom performs batch transfers
    function batchTransferFrom(address _from, address _to, uint256[] memory _tokenIds) public {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            transferFrom(_from, _to, _tokenIds[i]);
        }
    }

    //batchSafeTransferFrom performs safe batch transfers
    function batchSafeTransferFrom(address _from, address _to, uint256[] memory _tokenIds, bytes memory data_) public {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            safeTransferFrom(_from, _to, _tokenIds[i], data_);
        }
    }

    //isOwnerOf shows who is the owner of a token
    function isOwnerOf(address account, uint256[] calldata _tokenIds) external view returns (bool){
        for(uint256 i; i < _tokenIds.length; ++i ){
            if(_owners[_tokenIds[i]] != account)
                return false;
        }

        return true;
    }

    //isApprovedForAll approves proxies
    function isApprovedForAll(address _owner, address operator) public view override (ERC721, IERC721) returns (bool) { // override fix
        OpenSeaProxyRegistry proxyRegistry = OpenSeaProxyRegistry(proxyRegistryAddress);
        if (address(proxyRegistry.proxies(_owner)) == operator || projectProxy[operator]) return true;
        return super.isApprovedForAll(_owner, operator);
    }

    //_mint mints to wallet address
    function _mint(address to, uint256 tokenId) internal virtual override {
        _owners.push(to);
        emit Transfer(address(0), to, tokenId); //event
    }
}

contract OwnableDelegateProxy { }
contract OpenSeaProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}