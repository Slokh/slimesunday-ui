import {
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEditor } from "@slimesunday/context/editor";
import { useState } from "react";
import { BsImage, BsLayers } from "react-icons/bs";
import { MdPortrait } from "react-icons/md";
import { MacButtons, OpenSeaLogo } from "./Menu";
import {
  BackgroundsContent,
  LayersContent,
  PortraitsContent,
} from "./ModalContent";

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

const ModalOption = ({
  icon,
  text,
  onClick,
  isActive,
  isDisabled,
}: {
  icon: any;
  text: string;
  onClick: any;
  isActive?: boolean;
  isDisabled?: boolean;
}) => (
  <Flex
    align="center"
    onClick={isDisabled ? () => {} : onClick}
    cursor={isDisabled ? "default" : "pointer"}
  >
    <Icon as={icon} boxSize={4} color="#0082E4" />
    <Text
      pl={1}
      color={
        isDisabled ? "primary.300" : isActive ? "primary.100" : "primary.200"
      }
    >
      {text}
    </Text>
  </Flex>
);

export enum ModalType {
  Backgrounds = "Backgrounds",
  Portraits = "Portraits",
  Layers = "Layers",
  Shop = "Shop",
}

export const ModalRouter = ({
  isOpen,
  onClose,
  initialModalType,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialModalType: ModalType;
}) => {
  const { isPortraitsEnabled, isLayersEnabled } = useEditor();
  const [modalType, setModalType] = useState(initialModalType);

  const primaryOptionGroup = [
    {
      icon: BsImage,
      text: "Backgrounds",
      onClick: () => setModalType(ModalType.Backgrounds),
      isActive: modalType === ModalType.Backgrounds,
    },
    {
      icon: MdPortrait,
      text: "Portraits",
      onClick: () => setModalType(ModalType.Portraits),
      isDisabled: !isPortraitsEnabled,
      isActive: modalType === ModalType.Portraits,
    },
    {
      icon: BsLayers,
      text: "Layers",
      onClick: () => setModalType(ModalType.Layers),
      isDisabled: !isLayersEnabled,
      isActive: modalType === ModalType.Layers,
    },
  ];

  // const secondaryOptionGroup = [
  //   {
  //     icon: BsShop,
  //     text: "Shop",
  //     onClick: () => setModalType(ModalType.Shop),
  //     isActive: modalType === ModalType.Shop,
  //   },
  //   {
  //     icon: BsQuestionLg,
  //     text: "FAQ",
  //     onClick: () => setModalType(ModalType.Shop),
  //     isActive: modalType === ModalType.Shop,
  //   },
  // ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor="transparent" maxW="3xl">
        <ModalBody p={0} m={0}>
          <Flex cursor="default" userSelect="none">
            <Stack
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
              spacing={6}
            >
              <MacButtons onClick={onClose} />
              <Stack>
                {primaryOptionGroup.map((option, i) => (
                  <ModalOption key={i} {...option} />
                ))}
              </Stack>
              {/* <Divider borderColor="primary.300" />
              <Stack>
                {secondaryOptionGroup.map((option, i) => (
                  <ModalOption key={i} {...option} />
                ))}
              </Stack> */}
            </Stack>
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
                  {`Manage ${modalType}`}
                </Text>
                <Spacer />
                <OpenSeaLogo boxSize={6} />
              </Stack>
              <Flex w="full" h="sm">
                {modalType === ModalType.Backgrounds && (
                  <BackgroundsContent onClose={onClose} />
                )}
                {modalType === ModalType.Portraits && (
                  <PortraitsContent onClose={onClose} />
                )}
                {modalType === ModalType.Layers && (
                  <LayersContent onClose={onClose} />
                )}
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
