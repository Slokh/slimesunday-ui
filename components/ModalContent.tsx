import { Flex, Image, Spacer, Spinner, Stack, Text } from "@chakra-ui/react";
import { Layer, useEditor } from "@slimesunday/context/editor";
import {
  ABI,
  CONTRACT_ADDRESS,
  MINT_PRICE,
  TRANSFER_TOPIC,
} from "@slimesunday/utils";
import { Interface } from "ethers/lib/utils";
import { write } from "fs";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
  useProvider,
  useSigner,
  useWaitForTransaction,
} from "wagmi";

export const LayersContent = ({ onClose }: { onClose: any }) => {
  const [selectedLayer, setSelectedLayer] = useState<Layer>();
  const {
    available: { layers },
    addLayer,
  } = useEditor();

  return (
    <ImageContent
      files={layers}
      selectedFile={selectedLayer || layers?.[0]}
      onClick={setSelectedLayer}
      onDoubleClick={(background: Layer) => {
        addLayer(background);
        onClose();
      }}
    />
  );
};

export const BackgroundsContent = ({ onClose }: { onClose: any }) => {
  const [selectedBackground, setSelectedBackground] = useState<Layer>();
  const {
    available: { backgrounds },
    active: { background },
    setBackground,
  } = useEditor();

  return (
    <ImageContent
      files={backgrounds}
      selectedFile={selectedBackground || background || backgrounds?.[0]}
      onClick={setSelectedBackground}
      onDoubleClick={(background: Layer) => {
        setBackground(background);
        onClose();
      }}
    />
  );
};

export const PortraitsContent = ({ onClose }: { onClose: any }) => {
  const [selectedPortrait, setSelectedPortrait] = useState<Layer>();
  const {
    available: { portraits },
    active: { portrait },
    addPortrait,
  } = useEditor();

  return (
    <ImageContent
      files={portraits}
      selectedFile={selectedPortrait || portrait || portraits?.[0]}
      onClick={setSelectedPortrait}
      onDoubleClick={(background: Layer) => {
        addPortrait(background);
        onClose();
      }}
    />
  );
};

const ImageContent = ({ files, selectedFile, onClick, onDoubleClick }: any) => (
  <>
    <Flex
      maxH="inherit"
      direction="column"
      bgColor="primary"
      w={80}
      borderRightColor="secondary"
      borderRightWidth={1}
      fontSize="sm"
      overflowY="scroll"
    >
      {files.map((layer: Layer, i: number) => (
        <Flex
          key={i}
          bgColor={
            layer.id === selectedFile.id
              ? "tertiary"
              : i % 2 === 0
              ? "primarydark"
              : ""
          }
          onClick={() => onClick(layer)}
          onDoubleClick={
            layer.isDisabled ? () => {} : () => onDoubleClick(layer)
          }
          p={0.5}
          pl={2}
        >
          <Text
            pl={2}
            color={
              layer.isDisabled && layer.id !== selectedFile.id
                ? i % 2 === 0
                  ? "primary"
                  : "primarydark"
                : "secondary"
            }
          >
            {layer.name}
          </Text>
        </Flex>
      ))}
    </Flex>
    <Flex
      direction="column"
      bgColor="secondary"
      justify="center"
      align="center"
      w={72}
      borderBottomRightRadius={8}
    >
      {selectedFile && (
        <Stack spacing={6}>
          <Image src={selectedFile.image} w={56} alt={selectedFile.name} />
          <Flex
            borderRadius={16}
            justify="center"
            align="center"
            bgColor="primary"
            color={selectedFile.isDisabled ? "primarydark" : ""}
            cursor={selectedFile.isDisabled ? "default" : "pointer"}
            fontSize="sm"
            fontWeight="semibold"
            transition="all 0.2s ease"
            onClick={
              selectedFile.isDisabled
                ? () => {}
                : () => onDoubleClick(selectedFile)
            }
            _hover={
              selectedFile.isDisabled
                ? {}
                : {
                    bgColor: "primarydark",
                  }
            }
          >
            {selectedFile.isDisabled ? "Active" : "Select"}
          </Flex>
        </Stack>
      )}
    </Flex>
  </>
);

export const MintPacksContent = () => {
  const [mintedTokenIds, setMintedTokenIds] = useState<string[]>([]);
  const { randomize, importLayers } = useEditor();
  const contractWrite = useContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: new Interface(ABI),
    functionName: "mintSet",
  });
  const { isLoading } = useWaitForTransaction({
    hash: contractWrite.data?.hash,
    onSuccess(data) {
      setMintedTokenIds(
        data.logs
          .filter(({ topics }) => topics[0] === TRANSFER_TOPIC)
          .map(({ topics }) => topics[3])
      );
    },
  });

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
    <Flex
      w="full"
      direction="column"
      justify="space-between"
      align="center"
      fontSize="lg"
    >
      <Flex pt={8} textAlign="center">
        {`Mint a starter pack for ${MINT_PRICE} ETH to begin your scrapbooking adventure!`}
      </Flex>
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
        ) : (
          "Mint a Pack"
        )}
      </Flex>
    </Flex>
  );
};
