export const CONTRACT_ADDRESS = "0x6A2697beD007d0578dEA0235fbDF4bF0DB38e4B0";

export const METADATA_CONTRACT_ADDRESS =
  "0x5C0e87613120bbD6e40839f4897b90F7210D8f6b";

export const ABI = [
  "function mintSet() public payable",
  "function mint(uint256 numSets) public payable",
  "function mintAllowList(uint256 numSets, uint256 mintPrice, uint256 maxMintedSetsForWallet, uint256 startTime, bytes32[] calldata proof) public payable",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function burnAndBindSingleAndSetActiveLayers(uint256 baseTokenId, uint256 layerTokenId, uint256 packedActiveLayerIds) public",
  "function burnAndBindMultipleAndSetActiveLayers(uint256 baseTokenId, uint256[] calldata layerTokenIds, uint256 packedActiveLayerIds) public",
  "function getLayerId(uint256 tokenId) public view returns (uint256)",
  "function getBoundLayers(uint256 tokenId) external view returns (uint256[] memory)",
  "function getTokenURI(uint256 layerId, uint256 bindings, uint256[] calldata activeLayers, bytes32 layerSeed) external view returns (string memory)",
  "function setActiveLayers(uint256 baseTokenId, uint256 packedLayerIds) external",
  "function getActiveLayers(uint256 tokenId) public view  returns (uint256[] memory)",
  "function getNumberMintedForAddress(address addr) public view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event LayersBoundToToken(uint256 indexed tokenId, uint256 indexed boundLayersBitmap)",
];

export const ALLOWLIST_MINT_PRICE = 0.095;
export const MINT_PRICE = "0.15";
