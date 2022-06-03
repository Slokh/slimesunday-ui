import type { NextPage } from "next";
import {
  Box,
  Flex,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEditor } from "@slimesunday/context/editor";
import {
  BsFillStarFill,
  BsCheckLg,
  BsQuestionLg,
  BsPlusLg,
  BsXLg,
  BsCaretUpFill,
  BsCaretDownFill,
} from "react-icons/bs";
import { MdLogin } from "react-icons/md";

const MenuButton = ({ icon, text, onClick, isDisabled }: any) => (
  <Stack
    cursor={isDisabled ? "default" : "pointer"}
    align="center"
    direction="row"
    spacing={1}
    onClick={isDisabled ? () => {} : onClick}
    color={isDisabled ? "primary.300" : "primary.100"}
    borderRadius={8}
    p={2}
    pl={1}
    pr={1}
    _hover={isDisabled ? {} : { bgColor: "primary.600" }}
  >
    <Icon as={icon} boxSize={4} />
    <Text fontSize="xs" fontWeight="semibold">
      {text}
    </Text>
  </Stack>
);

const MenuDivider = () => (
  <Flex borderRightWidth={1} borderColor="primary.700" w={1} h={6} />
);

const AddLayerModal = ({ isOpen, onClose }: any) => {
  const { inactiveLayers, activateLayer } = useEditor();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="primary.500">
        <ModalHeader color="primary.100">Add Layer</ModalHeader>
        <ModalCloseButton color="primary.100" />
        <ModalBody>
          <Stack spacing={4}>
            {inactiveLayers.map((layer: any, i) => (
              <Stack
                key={i}
                direction="row"
                align="center"
                borderRadius={8}
                p={2}
                _hover={{ bgColor: "primary.600" }}
                cursor="pointer"
                onClick={() => {
                  activateLayer(layer);
                  onClose();
                }}
              >
                <Image boxSize={8} src={layer.image} alt={layer.name} />
                <Text color="primary.100" fontWeight="semibold" fontSize="sm">
                  {layer.name}
                </Text>
              </Stack>
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const Home: NextPage = () => {
  const {
    active,
    connect,
    account,
    name,
    activeLayers,
    deactivateLayer,
    incrementLayer,
    decrementLayer,
  } = useEditor();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      minH="100vh"
      w="full"
      bgColor="primary.700"
      color="primary.100"
      fontWeight="medium"
      fontSize="sm"
      direction="column"
    >
      <Flex
        h={7}
        w="full"
        bgColor="primary.500"
        justify="center"
        align="center"
        borderBottomWidth={1}
        borderBottomColor="primary.700"
        fontWeight="semibold"
        color="primary.100"
      >
        Slimeshop
      </Flex>
      <Flex
        h={10}
        p={2}
        pl={2}
        pr={2}
        w="full"
        bgColor="primary.500"
        borderBottomWidth={1}
        borderBottomColor="primary.700"
        align="center"
      >
        <Stack
          h="full"
          borderColor="primary.700"
          p={2}
          align="center"
          direction="row"
          spacing={2}
        >
          <MenuButton
            icon={MdLogin}
            text={active ? name || account : "Connect Wallet"}
            onClick={connect}
          />
          <MenuDivider />
          <MenuButton
            icon={BsFillStarFill}
            text="Mint Pack"
            isDisabled={!active}
          />
          <MenuButton icon={BsCheckLg} text="Submit" isDisabled={!active} />
          <MenuDivider />
          <MenuButton icon={BsQuestionLg} text="FAQ" />
        </Stack>
      </Flex>
      <Flex flexGrow={1}>
        <Flex flexGrow={1} justify="center" align="center">
          <Box position="relative" w="500px" h="625px" bgColor="primary.100">
            {activeLayers.map((layer: any, i) => (
              <Image
                position="absolute"
                key={i}
                src={layer.image}
                alt={layer.name}
              />
            ))}
          </Box>
        </Flex>
        <Flex direction="column" w={80} bgColor="primary.500">
          <Flex
            w="full"
            bgColor="primary.600"
            h={10}
            align="center"
            justify="space-between"
          >
            <Flex
              bgColor="primary.500"
              h="full"
              w={16}
              justify="center"
              align="center"
              fontSize="xs"
              fontWeight="semibold"
              color="primary.200"
            >
              Layers
            </Flex>
            <Flex>
              <MenuButton icon={BsPlusLg} onClick={onOpen} />
              <AddLayerModal isOpen={isOpen} onClose={onClose} />
            </Flex>
          </Flex>
          {activeLayers.map((layer: any, i) => (
            <Flex
              key={i}
              w="full"
              h={16}
              borderBottomWidth={1}
              borderBottomColor="primary.700"
              align="center"
              justify="space-between"
              p={2}
            >
              <Stack direction="row">
                <Image boxSize={8} src={layer.image} alt={layer.name} />
                <Text color="primary.100" fontWeight="semibold" fontSize="sm">
                  {layer.name}
                </Text>
              </Stack>
              <Stack direction="row" spacing={0}>
                <MenuButton
                  icon={BsCaretUpFill}
                  onClick={() => incrementLayer(layer)}
                  isDisabled={i === 0}
                />
                <MenuButton
                  icon={BsCaretDownFill}
                  onClick={() => decrementLayer(layer)}
                  isDisabled={i === activeLayers.length - 1}
                />
                <MenuButton
                  icon={BsXLg}
                  onClick={() => deactivateLayer(layer)}
                />
              </Stack>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;
