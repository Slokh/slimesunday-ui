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
      bgColor="#2C2834"
      w={80}
      borderRightColor="#26222E"
      borderRightWidth={1}
      color="primary.100"
      fontSize="sm"
      overflowY="scroll"
    >
      {files.map((layer: Layer, i: number) => (
        <Flex
          key={i}
          bgColor={
            layer === selectedFile ? "#0257CF" : i % 2 === 0 ? "#231D2A" : ""
          }
          onClick={() => onClick(layer)}
          onDoubleClick={
            layer.isDisabled ? () => {} : () => onDoubleClick(layer)
          }
          color={
            layer.isDisabled && layer !== selectedFile
              ? "primary.300"
              : "primary.100"
          }
          p={0.5}
          pl={2}
        >
          <Image src={layer.image} h={4} w="auto" alt={layer.name} />
          <Text pl={2}>{layer.name}</Text>
        </Flex>
      ))}
    </Flex>
    <Flex
      direction="column"
      bgColor="#464449"
      justify="center"
      align="center"
      w={72}
      borderBottomRightRadius={8}
    >
      {selectedFile && (
        <Stack spacing={6}>
          <Image src={selectedFile.image} w={56} alt={selectedFile.name} />
          <Flex
            borderWidth={selectedFile.isDisabled ? 0 : 1}
            borderRadius={16}
            borderColor="primary.300"
            justify="center"
            align="center"
            color={selectedFile.isDisabled ? "primary.300" : "primary.100"}
            cursor={selectedFile.isDisabled ? "default" : "pointer"}
            bgColor={selectedFile.isDisabled ? "primary.600" : "primary.500"}
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
