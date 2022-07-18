import { Flex, Image, Stack, Text } from "@chakra-ui/react";
import { Layer, useEditor } from "@slimesunday/context/editor";
import { useState } from "react";

export const LayersContent = ({ onClose }: { onClose: any }) => {
  const [selectedLayer, setSelectedLayer] = useState<Layer>();
  const {
    available: { layers },
    addLayer,
  } = useEditor();

  return (
    <ImageContent
      files={layers}
      selectedFile={selectedLayer}
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
    setBackground,
  } = useEditor();

  return (
    <ImageContent
      files={backgrounds}
      selectedFile={selectedBackground}
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
    setPortrait,
  } = useEditor();

  return (
    <ImageContent
      files={portraits}
      selectedFile={selectedPortrait}
      onClick={setSelectedPortrait}
      onDoubleClick={(background: Layer) => {
        setPortrait(background);
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
      bgColor="primary.100"
      w={80}
      borderRightColor="primary.600"
      borderRightWidth={1}
      fontSize="sm"
      overflowY="scroll"
    >
      {files.map((layer: Layer, i: number) => (
        <Flex
          key={i}
          bgColor={
            layer === selectedFile
              ? "primary.400"
              : i % 2 === 0
              ? "primary.200"
              : ""
          }
          onClick={() => onClick(layer)}
          onDoubleClick={
            layer.isDisabled ? () => {} : () => onDoubleClick(layer)
          }
          p={0.5}
          pl={2}
        >
          <Image src={layer.image} h={4} w="auto" alt={layer.name} />
          <Text
            pl={2}
            color={
              layer.isDisabled && layer !== selectedFile
                ? "primary.300"
                : "primary.700"
            }
          >
            {layer.name}
          </Text>
        </Flex>
      ))}
    </Flex>
    <Flex
      direction="column"
      bgColor="primary.600"
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
            bgColor="primary.200"
            color={selectedFile.isDisabled ? "disabled" : ""}
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
                    bgColor: "primary.400",
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
