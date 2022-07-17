import { Box, Flex, Icon, Image, useDisclosure } from "@chakra-ui/react";
import { useEditor } from "@slimesunday/context/editor";
import { BsPlusLg } from "react-icons/bs";
import { ModalRouter } from "./Modal";

const DisplayEmpty = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex
      w="500px"
      h="625px"
      bgColor="primary.100"
      color="primary.200"
      justify="center"
      align="center"
      cursor="pointer"
      transition="all 0.2s ease"
      onClick={onOpen}
      _hover={{
        color: "primary.300",
      }}
    >
      <Icon as={BsPlusLg} boxSize={16} />
      <ModalRouter
        isOpen={isOpen}
        onClose={onClose}
        activeModal="Backgrounds"
      />
    </Flex>
  );
};

const DisplayLayers = () => {
  const {
    active: { background, layers },
  } = useEditor();

  const displayLayers = [...layers].reverse();

  return (
    <Box position="relative" w="500px" h="625px" bgColor="primary.100">
      {background && (
        <Box position="absolute">
          <Image src={background.image} alt={background.name} />
        </Box>
      )}
      {displayLayers.map((layer: any, i) => (
        <Box key={i} position="absolute">
          <Image src={layer.image} alt={layer.name} />
        </Box>
      ))}
    </Box>
  );
};

export const Display = () => {
  const {
    active: { background },
  } = useEditor();

  return (
    <Flex flexGrow={1} justify="center" align="center">
      {background ? <DisplayLayers /> : <DisplayEmpty />}
    </Flex>
  );
};
