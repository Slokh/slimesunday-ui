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
import { IoMdClose, IoMdSwap } from "react-icons/io";
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
      color={isDisabled ? "primarydark" : "secondary"}
      borderRadius={8}
      w={7}
      h={7}
      transition="all 0.2s ease"
      cursor="pointer"
      align="center"
      justify="center"
      _hover={isDisabled ? {} : { bgColor: "primarydark" }}
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
}) => {
  const props = isDisabled
    ? {
        color: "primarydark",
      }
    : {
        cursor: "pointer",
      };

  return (
    <Row>
      <Flex
        w="full"
        h="full"
        justify="center"
        align="center"
        bgColor="primary"
        transition="all 0.2s ease"
        onClick={isDisabled ? () => {} : onClick}
        _hover={
          isDisabled
            ? {}
            : {
                bgColor: "primarydark",
              }
        }
        {...props}
      >
        {children}
      </Flex>
    </Row>
  );
};

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
      icon: IoMdSwap,
      onClick: onOpen,
    },
    [EditorRowAction.Delete]: {
      icon: IoMdClose,
      onClick: () => layer && removeLayer(layer),
    },
  };

  if (!layer) {
    return <Row />;
  }

  return (
    <Row isDraggable={isDraggable}>
      <Stack direction="row" align="center" pl={2}>
        <Box w={8} bgColor="secondary">
          <Image src={layer.image} alt={layer.name} />
        </Box>
        <Text fontWeight="semibold" fontSize="sm" pl={2}>
          {layer.name}
        </Text>
      </Stack>
      <Stack direction="row" spacing={0} pr={2}>
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
