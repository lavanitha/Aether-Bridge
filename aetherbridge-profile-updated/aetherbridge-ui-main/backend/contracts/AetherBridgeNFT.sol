// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title AetherBridgeNFT
 * @dev Smart contract for minting academic credentials as NFTs
 * @author AetherBridge Team
 */
contract AetherBridgeNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to credential data
    mapping(uint256 => CredentialData) public credentials;
    
    // Mapping from credential hash to token ID
    mapping(bytes32 => uint256) public credentialHashToTokenId;
    
    // Mapping from user address to their token IDs
    mapping(address => uint256[]) public userTokens;
    
    // Events
    event CredentialMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string credentialId,
        bytes32 credentialHash,
        string issuer,
        string credentialType
    );
    
    event CredentialRevoked(
        uint256 indexed tokenId,
        string reason,
        uint256 timestamp
    );
    
    event CredentialVerified(
        uint256 indexed tokenId,
        bool verified,
        uint256 timestamp
    );

    // Structs
    struct CredentialData {
        string credentialId;
        string issuer;
        string credentialType;
        string title;
        uint256 issueDate;
        uint256 expiryDate;
        bytes32 credentialHash;
        bool isRevoked;
        string revocationReason;
        uint256 revocationDate;
        bool isVerified;
        uint256 verificationDate;
    }

    constructor() ERC721("AetherBridge Academic Credentials", "ABAC") {
        _tokenIds.increment(); // Start from token ID 1
    }

    /**
     * @dev Mint a new credential NFT
     * @param to The address that will own the minted token
     * @param credentialId Unique identifier for the credential
     * @param issuer The issuing institution
     * @param credentialType Type of credential (degree, certificate, etc.)
     * @param title Title of the credential
     * @param issueDate Date when credential was issued
     * @param expiryDate Date when credential expires (0 for no expiry)
     * @param credentialHash Hash of the credential data
     * @param tokenURI URI for the token metadata
     */
    function mintCredential(
        address to,
        string memory credentialId,
        string memory issuer,
        string memory credentialType,
        string memory title,
        uint256 issueDate,
        uint256 expiryDate,
        bytes32 credentialHash,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        require(to != address(0), "Invalid recipient address");
        require(bytes(credentialId).length > 0, "Credential ID cannot be empty");
        require(bytes(issuer).length > 0, "Issuer cannot be empty");
        require(credentialHashToTokenId[credentialHash] == 0, "Credential already exists");
        
        uint256 newTokenId = _tokenIds.current();
        _tokenIds.increment();
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        // Store credential data
        credentials[newTokenId] = CredentialData({
            credentialId: credentialId,
            issuer: issuer,
            credentialType: credentialType,
            title: title,
            issueDate: issueDate,
            expiryDate: expiryDate,
            credentialHash: credentialHash,
            isRevoked: false,
            revocationReason: "",
            revocationDate: 0,
            isVerified: false,
            verificationDate: 0
        });
        
        credentialHashToTokenId[credentialHash] = newTokenId;
        userTokens[to].push(newTokenId);
        
        emit CredentialMinted(
            newTokenId,
            to,
            credentialId,
            credentialHash,
            issuer,
            credentialType
        );
        
        return newTokenId;
    }

    /**
     * @dev Revoke a credential
     * @param tokenId The token ID to revoke
     * @param reason Reason for revocation
     */
    function revokeCredential(uint256 tokenId, string memory reason) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(!credentials[tokenId].isRevoked, "Credential already revoked");
        
        credentials[tokenId].isRevoked = true;
        credentials[tokenId].revocationReason = reason;
        credentials[tokenId].revocationDate = block.timestamp;
        
        emit CredentialRevoked(tokenId, reason, block.timestamp);
    }

    /**
     * @dev Verify a credential
     * @param tokenId The token ID to verify
     */
    function verifyCredential(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(!credentials[tokenId].isRevoked, "Cannot verify revoked credential");
        
        credentials[tokenId].isVerified = true;
        credentials[tokenId].verificationDate = block.timestamp;
        
        emit CredentialVerified(tokenId, true, block.timestamp);
    }

    /**
     * @dev Get credential data by token ID
     * @param tokenId The token ID
     * @return CredentialData struct
     */
    function getCredentialData(uint256 tokenId) public view returns (CredentialData memory) {
        require(_exists(tokenId), "Token does not exist");
        return credentials[tokenId];
    }

    /**
     * @dev Get token ID by credential hash
     * @param credentialHash The credential hash
     * @return Token ID
     */
    function getTokenIdByHash(bytes32 credentialHash) public view returns (uint256) {
        return credentialHashToTokenId[credentialHash];
    }

    /**
     * @dev Get all tokens owned by a user
     * @param user The user address
     * @return Array of token IDs
     */
    function getUserTokens(address user) public view returns (uint256[] memory) {
        return userTokens[user];
    }

    /**
     * @dev Check if credential is valid (not revoked and not expired)
     * @param tokenId The token ID
     * @return True if valid
     */
    function isCredentialValid(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        
        CredentialData memory credential = credentials[tokenId];
        
        if (credential.isRevoked) {
            return false;
        }
        
        if (credential.expiryDate > 0 && block.timestamp > credential.expiryDate) {
            return false;
        }
        
        return true;
    }

    /**
     * @dev Get total number of minted tokens
     * @return Total count
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current() - 1;
    }

    /**
     * @dev Override required functions
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 