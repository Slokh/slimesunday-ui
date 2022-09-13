import { MerkleTree } from "merkletreejs";
import { BigNumber, ethers } from "ethers";
import { keccak256 } from "@ethersproject/keccak256";
import { ChainConfig } from ".";

interface ILeaf {
  address: string;
  mintPrice: BigNumber;
  maxMintedSetsForWallet: BigNumber;
  startTime: BigNumber;
}

export function findBestLeafForAddress(
  chainConfig: ChainConfig,
  address: string,
  minted: BigNumber
): {
  leaf?: ILeaf;
  proof?: string[];
} {
  const liteLeaves: string[] = chainConfig.allowlist;
  let leaves: ILeaf[] = [];
  for (let leaf of liteLeaves) {
    leaves.push({
      address: leaf.toLowerCase(),
      mintPrice: chainConfig.allowlistMintPrice,
      maxMintedSetsForWallet: BigNumber.from(5),
      startTime: BigNumber.from(chainConfig.saleStartTimestamp),
    });
    leaves.push({
      address: leaf.toLowerCase(),
      mintPrice: chainConfig.publicMintPrice,
      maxMintedSetsForWallet: BigNumber.from(10),
      startTime: BigNumber.from(chainConfig.saleStartTimestamp),
    });
  }
  const giftLeaves: string[] = chainConfig.giftlist;
  for (let leaf of giftLeaves) {
    leaves.push({
      address: leaf.toLowerCase(),
      mintPrice: BigNumber.from(0),
      maxMintedSetsForWallet: BigNumber.from(1),
      startTime: BigNumber.from(chainConfig.saleStartTimestamp),
    });
  }

  function hashLeaf(leaf: ILeaf) {
    // equiv to keccak(abi.encodePacked(address,mintPrice,maxMintedSetsForWallet,startTime))
    return ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256", "uint256"],
      [
        leaf.address,
        leaf.mintPrice,
        leaf.maxMintedSetsForWallet,
        leaf.startTime,
      ]
    );
  }

  const hashedLeaves = leaves.map(hashLeaf);

  const merkletree = new MerkleTree(hashedLeaves, keccak256, {
    sort: true,
    sortLeaves: true,
    hashLeaves: false,
  });

  // filter out all inactive leaves
  const activeLeaves: ILeaf[] = leaves.filter((leaf) =>
    // js timestamps are in milliseconds
    leaf.startTime.lt(BigNumber.from(Date.now()).div(1000))
  );
  // lowercase all addresses
  const lowerAddress = address.toLowerCase();
  // filter for the address we are searching for
  const addressLeaves = activeLeaves.filter(
    (leaf) => leaf.address.toLowerCase() === lowerAddress
  );

  // filter by max num minted quantity
  const eligibleAddressLeaves = addressLeaves.filter((leaf) =>
    leaf.maxMintedSetsForWallet.gt(minted)
  );
  // if no leaves are found, return null
  if (eligibleAddressLeaves.length === 0) {
    return {};
  }

  // find the eligible leaf with the best mint price for the user
  let best: ILeaf | null = null;
  for (let leaf of eligibleAddressLeaves) {
    if (best == null || leaf.mintPrice.lt(best.mintPrice)) {
      best = leaf;
    }
  }
  return {
    leaf: best || undefined,
    proof: best ? merkletree.getHexProof(hashLeaf(best)) : undefined,
  };
}
