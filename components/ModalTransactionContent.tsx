import { Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { LayerType, useEditor } from "@slimesunday/context/editor";
import {
  ABI,
  CONTRACT_ADDRESS,
  MINT_PRICE,
  TRANSFER_TOPIC,
} from "@slimesunday/utils";
import { BigNumber } from "ethers";
import { Interface } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { IoMdWarning } from "react-icons/io";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { Display } from "./Display";

export const MintPacksContent = () => {
  const [mintedTokenIds, setMintedTokenIds] = useState<string[]>([]);
  const { randomize, importLayers } = useEditor();

  useEffect(() => {
    const handle = async () => {
      await importLayers(mintedTokenIds);
      randomize();
    };
    if (mintedTokenIds?.length) {
      handle();
    }
  }, [importLayers, mintedTokenIds, randomize]);

  return (
    <TransactionContent
      heroText={`Mint a starter pack for ${MINT_PRICE} ETH to begin your scrapbooking adventure!`}
      buttonText="Mint a pack"
      functionName="mintSet"
      args={[]}
      onSuccess={(data) =>
        setMintedTokenIds(
          data.logs
            .filter(
              ({ topics }: { topics: string[] }) => topics[0] === TRANSFER_TOPIC
            )
            .map(({ topics }: { topics: string[] }) => topics[3])
        )
      }
    >
      <Stack
        direction="row"
        spacing={8}
        w="full"
        justify="center"
        align="center"
      >
        <Flex>{`${MINT_PRICE} ETH`}</Flex>
        <Flex>{`>`}</Flex>
        <Stack>
          <Text fontSize="md">* 1 Background</Text>
          <Text fontSize="md">* 1 Portrait</Text>
          <Text fontSize="md">* 5 Layers</Text>
        </Stack>
      </Stack>
    </TransactionContent>
  );
};

export const BindLayersContent = () => {
  const {
    active: { background, portrait, layers },
  } = useEditor();

  const finalLayers = background ? [background, ...layers] : layers;
  const baseTokenId = portrait?.tokenId;
  const layerTokenIds = finalLayers
    .filter((l) => l.layerType !== LayerType.Portrait && !l.isBound)
    .map((l) => l.tokenId);

  let packedLayerIds = BigNumber.from(0);
  for (let i = 0; i < finalLayers.length; i++) {
    packedLayerIds = packedLayerIds.or(
      BigNumber.from(finalLayers[i].layerId).shl(248 - i * 8)
    );
  }

  let functionAndArgs: [string, any[]] = [
    "burnAndBindMultipleAndSetActiveLayers",
    [baseTokenId, layerTokenIds, packedLayerIds],
  ];

  if (!layerTokenIds?.length) {
    functionAndArgs = ["setActiveLayers", [baseTokenId, packedLayerIds]];
  }

  return (
    <TransactionContent
      heroText={
        <Stack>
          <Text>Bind the selected layers to create your final NFT!</Text>
          <Text fontWeight="bold">
            <Icon as={IoMdWarning} />
            WARNING: This action is irreversible.
          </Text>
        </Stack>
      }
      buttonText="Bind layers"
      functionName={functionAndArgs[0]}
      args={functionAndArgs[1]}
      onSuccess={() => {}}
    >
      <Flex w="full" justify="space-between" pl={8} pr={8}>
        <Stack>
          <Text fontWeight="bold">Selected Layers</Text>
          {finalLayers.map((layer, i) => (
            <Stack direction="row" key={i}>
              <Text w={6} textAlign="end">{`${i + 1}.`}</Text>
              <Text>{`(${layer.layerType[0]})`}</Text>
              <Text>{layer.name}</Text>
            </Stack>
          ))}
        </Stack>
        <Display height="200px" width="160px" />
      </Flex>
    </TransactionContent>
  );
};

export const TransactionContent = ({
  heroText,
  buttonText,
  functionName,
  onSuccess,
  args,
  children,
}: {
  heroText: React.ReactNode;
  buttonText: string;
  functionName: string;
  onSuccess: (data: any) => void;
  args: any[];
  children: React.ReactNode;
}) => {
  const contractWrite = useContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: new Interface(ABI),
    functionName,
    args,
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
      <Flex pt={8} textAlign="center">
        {heroText}
      </Flex>
      {children}
      <Flex
        w="full"
        h={16}
        justify="center"
        align="center"
        fontSize="2xl"
        cursor="pointer"
        borderTopWidth={1}
        borderColor="secondary"
        onClick={() => contractWrite.write()}
        _hover={{ bgColor: "primarydark" }}
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