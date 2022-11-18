import { Flex, Image, Stack, Text } from "@chakra-ui/react";
import { BoundLayer, Layer, useEditor } from "@slimesunday/context/editor";
import { useEffect, useState } from "react";
import { Display } from "./Display";

export const LayersContent = ({ onClose }: { onClose: any }) => {
  const [selectedLayer, setSelectedLayer] = useState<Layer>();
  const { layers, addLayer } = useEditor();

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
    backgrounds,
    active: { background },
    addBackground,
  } = useEditor();

  return (
    <ImageContent
      files={backgrounds}
      selectedFile={selectedBackground || background || backgrounds?.[0]}
      onClick={setSelectedBackground}
      onDoubleClick={(background: Layer) => {
        addBackground(background);
        onClose();
      }}
    />
  );
};

export const PortraitsContent = ({ onClose }: { onClose: any }) => {
  const [selectedPortrait, setSelectedPortrait] = useState<Layer>();
  const {
    portraits,
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
      color="secondary"
      w={{ base: "full", md: 80 }}
      borderRightColor="secondary"
      borderRightWidth={1}
      fontSize="sm"
      overflowY="scroll"
    >
      {files.map((layer: Layer, i: number) => (
        <Flex
          key={i}
          bgColor={
            layer.tokenId === selectedFile.tokenId
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
              layer.isDisabled && layer.tokenId !== selectedFile.tokenId
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
      color="secondary"
      align="center"
      w={{ base: "full", md: 72 }}
      borderBottomRightRadius={8}
    >
      {selectedFile?.layerId >= 0 && (
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

export const WalletContent = ({ onClose }: { onClose: any }) => {
  const [selected, setSelectedLayer] = useState<BoundLayer>();
  const { boundLayers, setActive } = useEditor();

  useEffect(() => {
    setSelectedLayer(boundLayers[0]);
  }, [boundLayers]);

  return (
    <>
      <Flex
        maxH="inherit"
        direction="column"
        bgColor="primary"
        w={{ base: "full", md: 80 }}
        borderRightColor="secondary"
        borderRightWidth={1}
        fontSize="sm"
        overflowY="scroll"
      >
        {boundLayers.map((boundLayer: BoundLayer, i: number) => (
          <Flex
            key={i}
            bgColor={
              boundLayer == selected
                ? "tertiary"
                : i % 2 === 0
                ? "primarydark"
                : ""
            }
            onClick={() => setSelectedLayer(boundLayer)}
            onDoubleClick={() => {
              setActive(boundLayer);
              onClose();
            }}
            p={0.5}
            pl={2}
          >
            <Text pl={2} color="secondary">
              {`Token ${boundLayer.tokenId}`}
            </Text>
          </Flex>
        ))}
      </Flex>
      <Flex
        direction="column"
        bgColor="secondary"
        justify="center"
        align="center"
        w={{ base: "full", md: 72 }}
        borderBottomRightRadius={8}
      >
        <Display boundLayer={selected} width="200px" height="250px" />
      </Flex>
    </>
  );
};
