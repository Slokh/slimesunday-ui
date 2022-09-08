import {
  Flex,
  Link,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEditor } from "@slimesunday/context/editor";
import React, { useEffect, useState } from "react";
import { ModalType } from "./Modal";

import { EditorLayers } from "./EditorLayers";
import { DefaultRow, EditorRow, EditorRowAction, ModalRow } from "./EditorRow";
import { FAQ, OpenSeaLogo } from "./Menu";

const EditorStep = ({
  number,
  title,
  placeholder,
  showPlaceholder,
  alwaysShowPlaceholder,
  children,
}: {
  number: number;
  title: string;
  placeholder?: React.ReactNode;
  showPlaceholder?: boolean;
  alwaysShowPlaceholder?: boolean;
  isDisabled?: boolean;
  children?: React.ReactNode;
}) => (
  <Flex direction="column" borderBottomWidth={1} borderColor="secondary">
    <Text
      pl={2}
      fontWeight="bold"
      fontSize="xs"
      textTransform="uppercase"
      as="span"
    >
      {`Step ${number} - ${title}`}
    </Text>
    {!showPlaceholder && children}
    {(showPlaceholder || alwaysShowPlaceholder) && placeholder}
  </Flex>
);

export const Editor = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    active: { background, portrait, layers },
    layers: availableLayers,
    shuffle,
    clear,
    chainConfig,
    isBackgroundsEnabled,
    isPortraitsEnabled,
    isLayersEnabled,
    isBindingEnabled,
    isExistingEnabled,
  } = useEditor();
  const [time, setTime] = useState(Date.now() / 1000);
  const [saleOpen, setIsOpen] = useState(
    Date.now() / 1000 >= chainConfig.saleStartTimestamp
  );

  useEffect(() => {
    if (!saleOpen) {
      const timer = setTimeout(() => {
        setTime(Date.now() / 1000);
        setIsOpen(Date.now() / 1000 >= chainConfig.saleStartTimestamp);
      }, 1000);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  useEffect(() => {
    if (!localStorage.getItem("visited")) {
      onOpen();
      localStorage.setItem("visited", "true");
    }
  }, [onOpen]);

  return (
    <Flex direction="column" borderTopWidth={1} borderColor="secondary">
      <Stack
        direction="column"
        h="calc(100vh - 260px)"
        overflowY="scroll"
        spacing={2}
      >
        <Stack
          direction="row"
          w="full"
          spacing={0}
          borderBottomWidth={1}
          borderColor="secondary"
          divider={<StackDivider />}
        >
          {chainConfig.mintingDisabled ? (
            <DefaultRow>
              <Link
                href={`${chainConfig.openseaUrl}/collection/slimeshop-layers`}
                _hover={{}}
                isExternal
              >
                <Flex align="center">
                  <OpenSeaLogo pr={1} boxSize={5} />
                  Buy Layers
                </Flex>
              </Link>
            </DefaultRow>
          ) : (
            <ModalRow modalType={ModalType.MintPacks} isDisabled={!saleOpen}>
              Mint
            </ModalRow>
          )}
          <ModalRow
            modalType={ModalType.Wallet}
            isDisabled={!isExistingEnabled}
          >
            Wallet
          </ModalRow>
        </Stack>
        <EditorStep
          number={1}
          title="Select Background"
          placeholder={
            <ModalRow
              modalType={ModalType.Backgrounds}
              isDisabled={!isBackgroundsEnabled}
            >
              ADD A BACKGROUND
            </ModalRow>
          }
          showPlaceholder={!background}
        >
          <EditorRow
            layer={background}
            actions={[EditorRowAction.Swap]}
            modalType={ModalType.Backgrounds}
          />
        </EditorStep>
        <EditorStep
          number={2}
          title="Select Portrait"
          placeholder={
            <ModalRow
              modalType={ModalType.Portraits}
              isDisabled={!isPortraitsEnabled}
            >
              ADD A PORTRAIT
            </ModalRow>
          }
          showPlaceholder={!portrait}
        >
          <EditorRow
            layer={portrait}
            actions={[EditorRowAction.Swap]}
            modalType={ModalType.Portraits}
          />
        </EditorStep>
        <EditorStep
          number={3}
          title="Select Layers"
          placeholder={
            <ModalRow
              modalType={ModalType.Layers}
              isDisabled={!isLayersEnabled || layers.length == 30}
            >
              ADD A LAYER
            </ModalRow>
          }
          alwaysShowPlaceholder
        >
          <EditorLayers />
        </EditorStep>
      </Stack>
      <Stack
        direction="row"
        w="full"
        spacing={0}
        borderTopWidth={1}
        borderColor="secondary"
        divider={<StackDivider />}
      >
        <DefaultRow
          onClick={() => shuffle(true)}
          isDisabled={
            availableLayers.filter((l) => l.layerId !== -1).length === 0
          }
        >
          SHUFFLE ALL
        </DefaultRow>
        <DefaultRow
          onClick={() => shuffle(false)}
          isDisabled={!isLayersEnabled}
        >
          SHUFFLE
        </DefaultRow>
      </Stack>
      <Stack
        direction="row"
        w="full"
        spacing={0}
        borderTopWidth={1}
        borderColor="secondary"
        divider={<StackDivider />}
      >
        <DefaultRow
          onClick={clear}
          isDisabled={!background && !portrait && !layers?.length}
        >
          CLEAR
        </DefaultRow>
        <ModalRow
          modalType={ModalType.BindLayers}
          isDisabled={!isBindingEnabled}
        >
          BIND
        </ModalRow>
      </Stack>
      <Stack
        direction="row"
        w="full"
        spacing={0}
        borderTopWidth={1}
        borderColor="secondary"
        divider={<StackDivider />}
      >
        <DefaultRow onClick={onOpen}>FAQ</DefaultRow>
        <DefaultRow>
          <Link
            href={`https://opensea.io/collection/slimeshop-bind`}
            _hover={{}}
            isExternal
          >
            <Flex align="center">
              <OpenSeaLogo pr={1} boxSize={5} />
              GALLERY
            </Flex>
          </Link>
        </DefaultRow>
      </Stack>
      <FAQ isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};
