import {
  Box,
  Flex,
  Icon,
  Link,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { LayerType, useEditor } from "@slimesunday/context/editor";
import { ABI } from "@slimesunday/utils";
import { BigNumber, ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { IoMdWarning } from "react-icons/io";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { Display } from "./Display";

export const MintPacksContent = () => {
  const [numberOfPacks, setNumberOfPacks] = useState(1);
  const {
    allowlistData: [leaf, proof, maxMintable],
    chainConfig,
    shuffle,
    fetchLayers,
  } = useEditor();

  const isMintEnabled = Date.now() >= chainConfig.saleStartTimestamp;
  const isAllowlisted = !!proof && !!leaf && maxMintable > 0;

  return (
    <TransactionContent
      heroText={`Mint pack(s) to begin creating your collage!`}
      buttonText={`Mint ${numberOfPacks} pack${numberOfPacks > 1 ? "s" : ""}`}
      functionName={isAllowlisted ? "mintAllowList" : "mint"}
      args={
        isAllowlisted
          ? [
              numberOfPacks,
              leaf.mintPrice,
              leaf.maxMintedSetsForWallet,
              leaf.startTime,
              proof,
            ]
          : [numberOfPacks]
      }
      value={
        isAllowlisted
          ? leaf.mintPrice.mul(numberOfPacks)
          : chainConfig.publicMintPrice.mul(numberOfPacks)
      }
      onSuccess={async () => {
        await fetchLayers();
        await shuffle(true);
      }}
      isDisabled={!isMintEnabled}
    >
      <Stack spacing={8} h={{ base: "xs", md: "auto" }} justify="center">
        <Stack
          direction="row"
          spacing={8}
          w="full"
          justify="center"
          align="center"
        >
          <Flex fontSize="lg">{`${ethers.utils.formatEther(
            isAllowlisted
              ? leaf.mintPrice.mul(numberOfPacks)
              : chainConfig.publicMintPrice.mul(numberOfPacks)
          )} ETH`}</Flex>
          <Flex>{`>`}</Flex>
          <Stack>
            <Text fontSize="lg">{`* ${numberOfPacks} Background${
              numberOfPacks > 1 ? "s" : ""
            }`}</Text>
            <Text fontSize="lg">{`* ${numberOfPacks} Portrait${
              numberOfPacks > 1 ? "s" : ""
            }`}</Text>
            <Text fontSize="lg">{`* ${numberOfPacks * 5} Layers`}</Text>
          </Stack>
        </Stack>
        <Slider
          defaultValue={1}
          min={1}
          max={maxMintable}
          step={1}
          onChange={(val) => setNumberOfPacks(val)}
        >
          <SliderTrack bg="primarydark">
            <Box position="relative" right={10} />
            <SliderFilledTrack bg="black" />
          </SliderTrack>
          <SliderThumb boxSize={6} />
          {Array.from(Array(maxMintable).keys()).map((value) => (
            <SliderMark key={value} value={value + 1} pt={4}>
              {value + 1}
            </SliderMark>
          ))}
        </Slider>
      </Stack>
    </TransactionContent>
  );
};

export const BindLayersContent = () => {
  const {
    active: { background, portrait, layers, tokenId },
    fetchLayers,
    chainConfig,
  } = useEditor();

  const reversedLayers = [...layers].reverse();
  const finalLayers = background
    ? [background, ...reversedLayers]
    : reversedLayers;
  const baseTokenId = portrait?.tokenId;
  const layerTokenIds = finalLayers
    .filter((l) => l.layerType !== LayerType.Portrait && !l.isBound)
    .map((l) => l.tokenId);

  let activeLayerIds = finalLayers
    .filter((l) => !l.isHidden)
    .map(({ layerId }) => layerId);

  if (!tokenId && Date.now() / 1000 < chainConfig.signatureEndTimestamp) {
    activeLayerIds = [...activeLayerIds, 255];
  }
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
      successLink={`https://${
        chainConfig.saleStartTimestamp === 0 ? "testnets." : ""
      }opensea.io/assets/${chainConfig.contractAddress}/${baseTokenId}`}
    >
      <Flex direction="column" h={{ base: "md", md: "auto" }}>
        <Flex w="full" justify="center" pl={8} pr={8}>
          <Display height={"200px"} width="160px" />
        </Flex>
        <Text fontWeight="bold" color="red">
          <Icon as={IoMdWarning} />
          WARNING: This action is irreversible.
        </Text>
      </Flex>
    </TransactionContent>
  );
};

const TransactionToast = ({
  blockExplorerUrl,
  transactionHash,
  message,
  isLoading,
}: {
  blockExplorerUrl: string;
  transactionHash: string;
  message: string;
  isLoading?: boolean;
}) => (
  <Link
    href={`${blockExplorerUrl}/tx/${transactionHash}`}
    isExternal
    _hover={{}}
  >
    <Flex
      bgColor="primary"
      p={3}
      align="center"
      borderRadius={8}
      cursor="pointer"
    >
      {isLoading && <Spinner />}
      <Text ml={4}>{message}</Text>
    </Flex>
  </Link>
);

export const TransactionContent = ({
  heroText,
  buttonText,
  functionName,
  onSuccess,
  args,
  value,
  isDisabled,
  successLink,
  children,
}: {
  heroText: React.ReactNode;
  buttonText: string;
  functionName: string;
  onSuccess: (data: any) => void;
  args: any[];
  isDisabled?: boolean;
  value?: BigNumber;
  successLink?: string;
  children: React.ReactNode;
}) => {
  const { chainConfig } = useEditor();
  const toast = useToast();
  const toastIdRef = React.useRef();

  const contractWrite = useContractWrite({
    addressOrName: chainConfig.contractAddress,
    contractInterface: new Interface(ABI),
    functionName,
    args,
    overrides: {
      value,
    },
  });

  useEffect(() => {
    if (contractWrite.data?.hash && toastIdRef.current) {
      toast.update(toastIdRef.current, {
        position: "bottom-left",
        duration: null,
        render: () => (
          <TransactionToast
            blockExplorerUrl={chainConfig.blockExplorerUrl}
            transactionHash={contractWrite.data?.hash || ""}
            message="Waiting for transaction..."
            isLoading
          />
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractWrite.data?.hash]);

  const { isLoading } = useWaitForTransaction({
    hash: contractWrite.data?.hash,
    onSuccess: (data: any) => {
      onSuccess(data);
      update();
    },
  });

  function update() {
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, {
        position: "bottom-left",
        duration: 5000,
        render: () => (
          <TransactionToast
            blockExplorerUrl={chainConfig.blockExplorerUrl}
            transactionHash={contractWrite.data?.hash || ""}
            message="Transaction successful"
          />
        ),
      });
    }
  }

  const submit = async () => {
    await contractWrite.writeAsync();
    // @ts-ignore
    toastIdRef.current = toast({
      position: "bottom-left",
      duration: null,
      render: () => (
        <TransactionToast
          blockExplorerUrl={chainConfig.blockExplorerUrl}
          transactionHash={contractWrite.data?.hash || ""}
          message="Waiting for transaction..."
          isLoading
        />
      ),
    });
  };

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
      {contractWrite.status === "success" && !isLoading && successLink ? (
        <Link
          href={successLink}
          isExternal
          w="full"
          h={16}
          textAlign="center"
          pt={3}
          fontSize="2xl"
          borderTopWidth={1}
          borderColor="secondary"
          color={"black"}
          cursor={"pointer"}
          _hover={{ bgColor: "primarydark" }}
        >
          View on OpenSea
        </Link>
      ) : (
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
          onClick={
            isDisabled || isLoading || contractWrite.status === "loading"
              ? undefined
              : submit
          }
          _hover={
            isDisabled || isLoading || contractWrite.status === "loading"
              ? {}
              : { bgColor: "primarydark" }
          }
        >
          {isLoading || contractWrite.status === "loading" ? (
            <Spinner />
          ) : contractWrite.status === "error" ? (
            "Error submitting transaction"
          ) : (
            buttonText
          )}
        </Flex>
      )}
    </Flex>
  );
};
