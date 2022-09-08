import { BigNumber } from "ethers";

export const GALLERY_LINK =
  "https://testnets.opensea.io/collection/slimeshop-bind";

export const ABI = [
  "function mintSet() public payable",
  "function mint(uint256 numSets) public payable",
  "function mintAllowList(uint256 numSets, uint256 mintPrice, uint256 maxMintedSetsForWallet, uint256 startTime, bytes32[] calldata proof) public payable",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function burnAndBindSingleAndSetActiveLayers(uint256 baseTokenId, uint256 layerTokenId, uint256 packedActiveLayerIds) public",
  "function burnAndBindMultipleAndSetActiveLayers(uint256 baseTokenId, uint256[] calldata layerTokenIds, uint256 packedActiveLayerIds) public",
  "function getLayerId(uint256 tokenId) public view returns (uint256)",
  "function getBoundLayers(uint256 tokenId) external view returns (uint256[] memory)",
  "function getTokenURI(uint256 tokenId, uint256 layerId, uint256 bindings, uint256[] calldata activeLayers, bytes32 layerSeed) external view returns (string memory)",
  "function setActiveLayers(uint256 baseTokenId, uint256 packedLayerIds) external",
  "function getActiveLayers(uint256 tokenId) public view  returns (uint256[] memory)",
  "function getNumberMintedForAddress(address addr) public view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event LayersBoundToToken(address indexed owner, uint256 indexed tokenId, uint256 indexed boundLayersBitmap)",
];

export interface ChainConfig {
  blockExplorer: string;
  contractAddress: string;
  metadataContractAddress: string;
  publicMintPrice: BigNumber;
  allowlistMintPrice: BigNumber;
  saleStartTimestamp: number;
  signatureEndTimestamp: number;
}

export const CHAIN_CONFIG: {
  [key: number]: ChainConfig;
} = {
  1: {
    blockExplorer: "https://etherscan.io",
    contractAddress: "0x60Ee992dD2Fa9b6FC35E7895c3322370d052963e",
    metadataContractAddress: "0xaff53666eb1906576c3812dd8b05851677c1f32a",
    publicMintPrice: BigNumber.from("150000000000000000"),
    allowlistMintPrice: BigNumber.from("95000000000000000"),
    saleStartTimestamp: 1663264800,
    signatureEndTimestamp: 1663264800,
  },
  4: {
    blockExplorer: "https://rinkeby.etherscan.io",
    contractAddress: "0x60Ee992dD2Fa9b6FC35E7895c3322370d052963e",
    metadataContractAddress: "0xaff53666eb1906576c3812dd8b05851677c1f32a",
    publicMintPrice: BigNumber.from("0"),
    allowlistMintPrice: BigNumber.from("95000000000000000"),
    saleStartTimestamp: 0,
    signatureEndTimestamp: 0,
  },
};
