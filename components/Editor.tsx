import { chakra, Flex, Spacer, Stack, Text } from "@chakra-ui/react";
import { useEditor } from "@slimesunday/context/editor";
import React, { useEffect, useState } from "react";
import { ModalType } from "./Modal";

import { useAccount } from "wagmi";
import { EditorLayers } from "./EditorLayers";
import { DefaultRow, EditorRow, EditorRowAction, ModalRow } from "./EditorRow";

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
  <Flex direction="column">
    <Text
      pl={2}
      color="primary.200"
      fontWeight="bold"
      fontSize="xs"
      textTransform="uppercase"
      as="span"
    >
      {`Step ${number} - `}
      <chakra.span color="primary.100">{title}</chakra.span>
    </Text>
    {!showPlaceholder && children}
    {(showPlaceholder || alwaysShowPlaceholder) && placeholder}
  </Flex>
);

export const Editor = () => {
  const [isActive, setActive] = useState(false);
  const {
    active: { background, portrait, layers },
    randomize,
  } = useEditor();
  const { isConnected } = useAccount();

  useEffect(() => {
    setActive(isConnected);
  }, [isConnected]);

  const isStep1Active = isActive;
  const isStep2Active = isActive && background;
  const isStep3Active =
    isActive && background && portrait && layers.length <= 30;
  const isMintActive = isActive && layers.length >= 5 && false;

  return (
    <Stack direction="column" h="full" pt={4} spacing={6}>
      <EditorStep
        number={1}
        title="Background"
        placeholder={
          <ModalRow
            modalType={ModalType.Backgrounds}
            isDisabled={!isStep1Active}
          >
            Add a background
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
        title="Portrait"
        placeholder={
          <ModalRow modalType={ModalType.Portraits} isDisabled={!isStep2Active}>
            Add a portrait
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
        title="Layers"
        placeholder={
          <ModalRow modalType={ModalType.Layers} isDisabled={!isStep3Active}>
            Add a layer
          </ModalRow>
        }
        alwaysShowPlaceholder
      >
        <EditorLayers />
      </EditorStep>
      <Spacer />
      <Stack direction="row" w="full">
        <DefaultRow onClick={randomize}>Randomize</DefaultRow>
        <DefaultRow isDisabled={!isMintActive}>Mint</DefaultRow>
      </Stack>
    </Stack>
  );
};
