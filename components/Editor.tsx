import { Flex, Link, Stack, StackDivider, Text } from "@chakra-ui/react";
import { useEditor } from "@slimesunday/context/editor";
import React from "react";
import { ModalType } from "./Modal";

import { EditorLayers } from "./EditorLayers";
import { DefaultRow, EditorRow, EditorRowAction, ModalRow } from "./EditorRow";
import { useRouter } from "next/router";
import { OpenSeaLogo } from "./Menu";

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
  const {
    active: { background, portrait, layers },
    shuffle,
    clear,
    isBackgroundsEnabled,
    isPortraitsEnabled,
    isLayersEnabled,
    isBindingEnabled,
    isExistingEnabled,
  } = useEditor();

  return (
    <Flex direction="column" borderTopWidth={1} borderColor="secondary">
      <Stack
        direction="column"
        h="calc(100vh - 295px)"
        overflowY="scroll"
        spacing={4}
      >
        <Stack
          direction="row"
          w="full"
          spacing={0}
          borderBottomWidth={1}
          borderColor="secondary"
          divider={<StackDivider />}
        >
          <ModalRow modalType={ModalType.MintPacks}>New...</ModalRow>
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
          title="Rearrange Layers"
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
        <DefaultRow onClick={() => shuffle(true)}>SHUFFLE ALL</DefaultRow>
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
          isDisabled={!background && !portrait && !layers}
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
      <Stack w="full" borderTopWidth={1} borderColor="secondary">
        <Link
          href="https://testnets.opensea.io/collection/test-r8wu178kdo?search[numericTraits][0][name]=Layer%20Count&search[numericTraits][0][ranges][0][min]=7&search[numericTraits][0][ranges][0][max]=7&search[sortAscending]=true&search[sortBy]=UNIT_PRICE"
          _hover={{}}
          isExternal
        >
          <DefaultRow>
            <Flex align="center">
              <OpenSeaLogo pr={1} boxSize={5} />
              GALLERY
            </Flex>
          </DefaultRow>
        </Link>
      </Stack>
    </Flex>
  );
};
