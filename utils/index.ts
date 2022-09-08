import { BigNumber } from "ethers";
import { mainnetAllowlist } from "./allowlist_mainnet";
import { rinkebyAllowlist } from "./allowlist_rinkeby";

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
  blockExplorerUrl: string;
  openseaUrl: string;
  contractAddress: string;
  metadataContractAddress: string;
  publicMintPrice: BigNumber;
  allowlistMintPrice: BigNumber;
  saleStartTimestamp: number;
  signatureEndTimestamp: number;
  allowlist: string[];
  mintingDisabled: boolean;
}

export const CHAIN_CONFIG: {
  [key: number]: ChainConfig;
} = {
  1: {
    blockExplorerUrl: "https://etherscan.io",
    openseaUrl: "https://opensea.io",
    contractAddress: "0x60Ee992dD2Fa9b6FC35E7895c3322370d052963e",
    metadataContractAddress: "0xaff53666eb1906576c3812dd8b05851677c1f32a",
    publicMintPrice: BigNumber.from("150000000000000000"),
    allowlistMintPrice: BigNumber.from("95000000000000000"),
    saleStartTimestamp: 1663264800,
    signatureEndTimestamp: 1663264800,
    allowlist: mainnetAllowlist,
    mintingDisabled: false,
  },
  4: {
    blockExplorerUrl: "https://rinkeby.etherscan.io",
    openseaUrl: "https://testnets.opensea.io",
    contractAddress: "0x0729aea2abcd275a051926290597112b9a6640b6",
    metadataContractAddress: "0x2f71c0180a94549a222cf5c4fe69ecbe91abdfd3",
    publicMintPrice: BigNumber.from("150000000000000000"),
    allowlistMintPrice: BigNumber.from("95000000000000000"),
    saleStartTimestamp: 1662632144,
    signatureEndTimestamp: 1662646544,
    allowlist: rinkebyAllowlist,
    mintingDisabled: false,
  },
};
