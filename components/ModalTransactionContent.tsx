import { Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { LayerType, useEditor } from "@slimesunday/context/editor";
import { ABI, CONTRACT_ADDRESS, MINT_PRICE } from "@slimesunday/utils";
import { ALLOWLIST_END_TIME } from "@slimesunday/utils/allowlist";
import { BigNumber, ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
import React from "react";
import {
  BsFillEyeFill,
  BsFillEyeSlashFill,
  BsImage,
  BsLayers,
  BsPersonFill,
} from "react-icons/bs";
import { IoMdWarning } from "react-icons/io";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { Display } from "./Display";

export const MintPacksContent = () => {
  const {
    allowlistData: [leaf, proof],
    allowlistEnabled,
    shuffle,
    fetchLayers,
  } = useEditor();

  // const isPublicMintEnabled = Date.now() >= ALLOWLIST_END_TIME.getTime();
  const isPublicMintEnabled = !allowlistEnabled;
  const isAllowListEnabled = !!proof && !!leaf;

  return (
    <TransactionContent
      heroText={`Mint a starter pack for ${MINT_PRICE} ETH to begin your collage!`}
      buttonText="Mint a pack"
      functionName={isPublicMintEnabled ? "mint" : "mintAllowList"}
      args={
        isPublicMintEnabled
          ? [1]
          : isAllowListEnabled
          ? [
              BigNumber.from(1),
              leaf.mintPrice,
              leaf.maxMintedSetsForWallet,
              leaf.startTime,
              proof,
            ]
          : []
      }
      value={isPublicMintEnabled ? 0 : isAllowListEnabled ? leaf.mintPrice : 0}
      onSuccess={async () => {
        await fetchLayers();
        shuffle(true);
      }}
      isDisabled={!isAllowListEnabled && !isPublicMintEnabled}
    >
      <Stack>
        <Stack
          direction="row"
          spacing={8}
          w="full"
          justify="center"
          align="center"
        >
          <Flex>{`${
            isAllowListEnabled ? leaf.mintPrice / 1e18 : MINT_PRICE
          } ETH`}</Flex>
          <Flex>{`>`}</Flex>
          <Stack>
            <Text fontSize="md">* 1 Background</Text>
            <Text fontSize="md">* 1 Portrait</Text>
            <Text fontSize="md">* 5 Layers</Text>
          </Stack>
        </Stack>
      </Stack>
    </TransactionContent>
  );
};

export const BindLayersContent = () => {
  const {
    active: { background, portrait, layers },
    fetchLayers,
  } = useEditor();

  const finalLayers = background ? [background, ...layers] : layers;
  const baseTokenId = portrait?.tokenId;
  const layerTokenIds = finalLayers
    .filter((l) => l.layerType !== LayerType.Portrait && !l.isBound)
    .map((l) => l.tokenId);

  const activeLayerIds = [
    255,
    ...finalLayers.filter((l) => !l.isHidden).map(({ layerId }) => layerId),
  ];
  let packedLayerIds = BigNumber.from(0);
  for (let i = 0; i < activeLayerIds.length; i++) {
    packedLayerIds = packedLayerIds.or(
      BigNumber.from(activeLayerIds[i]).shl(248 - i * 8)
    );
  }

  let functionAndArgs: [string, any[]] = [
    "burnAndBindMultipleAndSetActiveLayers",
    [baseTokenId, layerTokenIds, packedLayerIds],
  ];

  if (!layerTokenIds?.length) {
    functionAndArgs = ["setActiveLayers", [baseTokenId, packedLayerIds]];
  }

  console.log(functionAndArgs);

  const icons = {
    Background: BsImage,
    Portrait: BsPersonFill,
    Layer: BsLayers,
  };

  return (
    <TransactionContent
      heroText={
        <Stack>
          <Text>
            By binding, you give permission for SlimeSunday to use the created
            piece as they like.
          </Text>
        </Stack>
      }
      buttonText="Bind layers"
      functionName={functionAndArgs[0]}
      args={functionAndArgs[1]}
      onSuccess={async () => {
        await fetchLayers();
      }}
    >
      <Flex w="full" justify="space-between" pl={8} pr={8}>
        <Stack>
          {finalLayers.map((layer, i) => (
            <Stack direction="row" key={i}>
              <Text>
                <Icon
                  as={layer.isHidden ? BsFillEyeSlashFill : BsFillEyeFill}
                />
              </Text>
              <Text>
                <Icon as={icons[layer.layerType]} />
              </Text>
              <Text>{layer.name}</Text>
            </Stack>
          ))}
        </Stack>
        <Display height="200px" width="160px" />
      </Flex>
      <Text fontWeight="bold" color="red">
        <Icon as={IoMdWarning} />
        WARNING: This action is irreversible.
      </Text>
    </TransactionContent>
  );
};

export const TransactionContent = ({
  heroText,
  buttonText,
  functionName,
  onSuccess,
  args,
  value,
  isDisabled,
  children,
}: {
  heroText: React.ReactNode;
  buttonText: string;
  functionName: string;
  onSuccess: (data: any) => void;
  args: any[];
  isDisabled?: boolean;
  value?: BigNumber;
  children: React.ReactNode;
}) => {
  const contractWrite = useContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: new Interface(ABI),
    functionName,
    args,
    overrides: {
      value,
    },
  });
  const { isLoading } = useWaitForTransaction({
    hash: contractWrite.data?.hash,
    onSuccess,
  });

  return (
    <Flex
      w="full"
      direction="column"
      justify="space-between"
      align="center"
      fontSize="lg"
    >
      <Flex pt={4} textAlign="center">
        {heroText}
      </Flex>
      {children}
      <Flex
        w="full"
        h={16}
        justify="center"
        align="center"
        fontSize="2xl"
        borderTopWidth={1}
        borderColor="secondary"
        color={isDisabled ? "primarydark" : "black"}
        cursor={isDisabled ? "default" : "pointer"}
        onClick={isDisabled ? undefined : () => contractWrite.write()}
        _hover={isDisabled ? {} : { bgColor: "primarydark" }}
      >
        {isLoading || contractWrite.status === "loading" ? (
          <Spinner />
        ) : contractWrite.status === "error" ? (
          "Error submitting transaction"
        ) : contractWrite.status === "success" ? (
          "Transaction successful!"
        ) : (
          buttonText
        )}
      </Flex>
    </Flex>
  );
};
