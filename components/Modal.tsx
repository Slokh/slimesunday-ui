import {
  Divider,
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
import { BsImage, BsLayers, BsPersonFill, BsStarFill } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { MacButtons, OpenSeaLogo } from "./Menu";
import {
  BackgroundsContent,
  LayersContent,
  PortraitsContent,
  WalletContent,
} from "./ModalImageContent";
import { BindLayersContent, MintPacksContent } from "./ModalTransactionContent";

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
    <Icon
      as={icon}
      boxSize={4}
      color={isDisabled ? "primarydark" : isActive ? "black" : "secondary"}
    />
    <Text
      color={isDisabled ? "primarydark" : isActive ? "black" : "secondary"}
      pl={1}
      fontWeight={isActive ? "bold" : "medium"}
      whiteSpace="nowrap"
    >
      {text}
    </Text>
  </Flex>
);

export enum ModalType {
  Backgrounds = "Backgrounds",
  Portraits = "Portraits",
  Layers = "Layers",
  Wallet = "Wallet",
  MintPacks = "Mint Packs",
  BindLayers = "Bind Layers",
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
  const { backgrounds, portraits, layers, boundLayers, isBindingEnabled } =
    useEditor();
  const [modalType, setModalType] = useState(initialModalType);

  const primaryOptionGroup = [
    {
      icon: BsImage,
      text: `Backgrounds (${backgrounds.length})`,
      onClick: () => setModalType(ModalType.Backgrounds),
      isActive: modalType === ModalType.Backgrounds,
    },
    {
      icon: BsPersonFill,
      text: `Portraits (${portraits.length})`,
      onClick: () => setModalType(ModalType.Portraits),
      isActive: modalType === ModalType.Portraits,
    },
    {
      icon: BsLayers,
      text: `Layers (${layers.length})`,
      onClick: () => setModalType(ModalType.Layers),
      isActive: modalType === ModalType.Layers,
    },
    {
      icon: FaFolderOpen,
      text: `Wallet (${boundLayers.length})`,
      onClick: () => setModalType(ModalType.Wallet),
      isActive: modalType === ModalType.Wallet,
    },
  ];

  const secondaryOptionGroup: any[] = [
    {
      icon: FiPackage,
      text: "Mint packs",
      onClick: () => setModalType(ModalType.MintPacks),
      isActive: modalType === ModalType.MintPacks,
    },
    {
      icon: BsStarFill,
      text: "Bind layers",
      onClick: () => setModalType(ModalType.BindLayers),
      isDisabled: !isBindingEnabled,
      isActive: modalType === ModalType.BindLayers,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor="transparent" maxW="3xl">
        <ModalBody p={0} m={0}>
          <Flex cursor="default" userSelect="none">
            <Stack
              bgColor="primary"
              w="full"
              borderTopLeftRadius={8}
              borderBottomLeftRadius={8}
              borderRightColor="secondary"
              borderRightWidth={1}
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
              <Divider borderColor="secondary" />
              <Stack>
                {secondaryOptionGroup.map((option, i) => (
                  <ModalOption key={i} {...option} />
                ))}
              </Stack>
            </Stack>
            <Flex w="full" direction="column">
              <Stack
                direction="row"
                bgColor="primary"
                w="full"
                align="center"
                borderTopRightRadius={8}
                borderBottomColor="secondary"
                borderBottomWidth={1}
                p={4}
              >
                <Text fontWeight="bold" fontSize="md">
                  {modalType}
                </Text>
                <Spacer />
                <OpenSeaLogo boxSize={6} />
              </Stack>
              <Flex bgColor="primary" w="xl" h="sm" borderBottomRightRadius={8}>
                {modalType === ModalType.Backgrounds && (
                  <BackgroundsContent onClose={onClose} />
                )}
                {modalType === ModalType.Portraits && (
                  <PortraitsContent onClose={onClose} />
                )}
                {modalType === ModalType.Layers && (
                  <LayersContent onClose={onClose} />
                )}
                {modalType === ModalType.Wallet && (
                  <WalletContent onClose={onClose} />
                )}
                {modalType === ModalType.MintPacks && <MintPacksContent />}
                {modalType === ModalType.BindLayers && <BindLayersContent />}
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
