import {
  Box,
  Flex,
  Icon,
  Image,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Layer, useEditor } from "@slimesunday/context/editor";
import React from "react";
import { BsX } from "react-icons/bs";
import { MdOutlineSwapHoriz } from "react-icons/md";
import { ModalRouter, ModalType } from "./Modal";

export const RowButton = ({
  icon,
  boxSize,
  onClick,
  isDisabled,
}: {
  icon: any;
  boxSize?: number;
  onClick?: any;
  isDisabled?: boolean;
}) => {
  return (
    <Flex
      onClick={isDisabled ? () => {} : onClick}
      color={isDisabled ? "primary.300" : "primary.100"}
      borderRadius={8}
      w={7}
      h={7}
      transition="all 0.2s ease"
      cursor="pointer"
      align="center"
      justify="center"
      _hover={isDisabled ? {} : { bgColor: "primary.600" }}
    >
      <Icon as={icon} boxSize={boxSize || 5} />
    </Flex>
  );
};

export const Row = ({
  isDraggable,
  children,
}: {
  isDraggable?: boolean;
  children?: React.ReactNode;
}) => (
  <Flex
    w="full"
    h={16}
    align="center"
    justify="space-between"
    p={2}
    cursor={isDraggable ? "move" : "default"}
  >
    {children}
  </Flex>
);

export const DefaultRow = ({
  isDisabled,
  onClick,
  children,
}: {
  isDisabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <Row>
    <Flex
      borderWidth={isDisabled ? 0 : 1}
      borderRadius={16}
      borderColor="primary.300"
      w="full"
      h="full"
      justify="center"
      align="center"
      color={isDisabled ? "primary.300" : "primary.100"}
      cursor={isDisabled ? "default" : "pointer"}
      bgColor={isDisabled ? "primary.600" : "primary.500"}
      transition="all 0.2s ease"
      onClick={isDisabled ? () => {} : onClick}
      _hover={
        isDisabled
          ? {}
          : {
              bgColor: "primary.400",
            }
      }
    >
      {children}
    </Flex>
  </Row>
);

export const ModalRow = ({
  modalType,
  isDisabled,
  children,
}: {
  modalType?: ModalType;
  isDisabled?: boolean;
  children: React.ReactNode;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <DefaultRow isDisabled={isDisabled} onClick={onOpen}>
        {children}
      </DefaultRow>
      {modalType && (
        <ModalRouter
          isOpen={isOpen}
          onClose={onClose}
          initialModalType={modalType}
        />
      )}
    </>
  );
};

export enum EditorRowAction {
  Swap = "Swap",
  Delete = "Delete",
}

export const EditorRow = ({
  layer,
  actions,
  modalType,
  isDraggable,
}: {
  layer?: Layer;
  actions: EditorRowAction[];
  modalType?: ModalType;
  isDraggable?: boolean;
}) => {
  const { removeLayer } = useEditor();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const options = {
    [EditorRowAction.Swap]: {
      icon: MdOutlineSwapHoriz,
      onClick: onOpen,
    },
    [EditorRowAction.Delete]: {
      icon: BsX,
      onClick: () => layer && removeLayer(layer),
    },
  };

  if (!layer) {
    return <Row />;
  }

  return (
    <Row isDraggable={isDraggable}>
      <Stack direction="row" align="center">
        <Box boxSize={8}>
          <Image src={layer.image} alt={layer.name} />
        </Box>
        <Text color="primary.100" fontWeight="semibold" fontSize="sm" pl={2}>
          {layer.name}
        </Text>
      </Stack>
      <Stack direction="row" spacing={0}>
        {actions.map((action, i) => {
          const { icon, onClick } = options[action];

          return <RowButton key={i} icon={icon} onClick={onClick} />;
        })}
      </Stack>
      {modalType && (
        <ModalRouter
          isOpen={isOpen}
          onClose={onClose}
          initialModalType={modalType}
        />
      )}
    </Row>
  );
};
