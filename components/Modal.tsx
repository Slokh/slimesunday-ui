import {
  Flex,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Layer, useEditor } from "@slimesunday/context/editor";
import { useEffect, useState } from "react";
import { BsImage, BsLayers, BsPaintBucket, BsShop } from "react-icons/bs";
import { MacButtons } from "./Menu";

export const GenericModal = ({ isOpen, onClose, children }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor="transparent" maxW="3xl">
        <ModalBody p={0} m={0}>
          <Flex cursor="default" userSelect="none">
            <Flex
              direction="column"
              bgColor="#464449"
              w="full"
              borderTopLeftRadius={8}
              borderBottomLeftRadius={8}
              borderRightColor="#26222E"
              borderRightWidth={1}
              color="primary.200"
              fontWeight="medium"
              fontSize="sm"
              p={4}
            >
              <MacButtons />
              <Stack mt={6}>
                <Flex align="center">
                  <Icon as={BsPaintBucket} boxSize={4} color="#0082E4" />
                  <Text pl={1}>SlimeSunday</Text>
                </Flex>
                <Flex align="center">
                  <Icon as={BsPaintBucket} boxSize={4} color="#0082E4" />
                  <Text pl={1}>OpenSea</Text>
                </Flex>
                <Flex align="center">
                  <Icon as={BsPaintBucket} boxSize={4} color="#0082E4" />
                  <Text pl={1}>Hello</Text>
                </Flex>
                <Flex align="center">
                  <Icon as={BsPaintBucket} boxSize={4} color="#0082E4" />
                  <Text pl={1}>World</Text>
                </Flex>
              </Stack>
            </Flex>
            {children}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ModalButton = ({
  icon,
  text,
  onClick,
  isDisabled,
  isSelected,
}: {
  icon: any;
  text: string;
  onClick?: any;
  isDisabled?: boolean;
  isSelected?: boolean;
}) => (
  <Stack
    cursor={isDisabled ? "default" : "pointer"}
    align="center"
    direction="row"
    spacing={1}
    onClick={isDisabled ? () => {} : onClick}
    color={
      isDisabled ? "primary.300" : isSelected ? "primary.0" : "primary.200"
    }
    borderRadius={8}
    p={0.5}
    pl={2}
    pr={2}
    transition="all 0.2s ease"
    _hover={isDisabled ? {} : { color: "primary.0" }}
  >
    <Icon as={icon} boxSize={3} />
    <Text fontSize="xs" fontWeight="semibold">
      {text}
    </Text>
  </Stack>
);

export const ModalRouter = ({ isOpen, onClose, activeModal }: any) => {
  const [content, setContent] = useState(activeModal);

  const Content = content === "Layers" ? LayersContent : BackgroundsContent;
  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <Flex w="full" direction="column">
        <Stack
          direction="row"
          bgColor="#3A363E"
          w="full"
          align="center"
          borderTopRightRadius={8}
          borderBottomColor="#26222E"
          borderBottomWidth={1}
          p={4}
        >
          <Text color="primary.100" fontWeight="bold">
            {`Manage ${activeModal}`}
          </Text>
          <Spacer />
          <ModalButton
            icon={BsImage}
            text="Backgrounds"
            onClick={() => setContent("Backgrounds")}
            isSelected={content === "Backgrounds"}
          />
          <ModalButton
            icon={BsLayers}
            text="Layers"
            onClick={() => setContent("Layers")}
            isSelected={content === "Layers"}
          />
          <ModalButton icon={BsShop} text="Shop" isDisabled />
        </Stack>
        <Flex w="full" h="sm">
          <Content onClose={onClose} />
        </Flex>
      </Flex>
    </GenericModal>
  );
};

const LayersContent = ({ onClose }: { onClose: any }) => {
  const [selectedLayer, setSelectedLayer] = useState<Layer>();
  const {
    available: { layers },
    addLayer,
  } = useEditor();

  useEffect(() => {
    if (layers?.length) {
      setSelectedLayer(layers[0]);
    }
  }, [layers]);

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

const BackgroundsContent = ({ onClose }: { onClose: any }) => {
  const [selectedBackground, setSelectedBackground] = useState<Layer>();
  const {
    available: { backgrounds },
    setBackground,
  } = useEditor();

  useEffect(() => {
    if (backgrounds?.length) {
      setSelectedBackground(backgrounds[0]);
    }
  }, [backgrounds]);

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
      {files.map((layer: any, i: number) => (
        <Flex
          key={i}
          bgColor={
            layer === selectedFile ? "#0257CF" : i % 2 === 0 ? "#231D2A" : ""
          }
          onClick={() => onClick(layer)}
          onDoubleClick={() => onDoubleClick(layer)}
          p={0.5}
          pl={2}
        >
          <Image src={layer.image} h={4} w="auto" alt={layer.name} />
          <Text pl={2}>{layer.name}</Text>
        </Flex>
      ))}
    </Flex>
    <Flex
      bgColor="#464449"
      justify="center"
      align="center"
      w={72}
      borderBottomRightRadius={8}
    >
      {selectedFile && (
        <Image src={selectedFile.image} w={56} alt={selectedFile.name} />
      )}
    </Flex>
  </>
);
