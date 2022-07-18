import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ConnectButton } from "./ConnectButton";
import { Editor } from "./Editor";

export const MacButtons = (props: any) => (
  <Stack direction="row" spacing={2} {...props}>
    <Box w={3} h={3} borderRadius={64} bgColor="primary.600" />
    <Box w={3} h={3} borderRadius={64} bgColor="primary.500" />
    <Box w={3} h={3} borderRadius={64} bgColor="primary.400" />
  </Stack>
);

export const OpenSeaLogo = (props: any) => {
  const { boxSize, ...rest } = props;

  return (
    <Flex {...rest}>
      <Image
        src="https://opensea.io/static/images/logos/opensea.svg"
        alt="opensea"
        w={boxSize}
        h={boxSize}
      />
    </Flex>
  );
};

export const Menu = () => {
  return (
    <Flex
      h={7}
      w="full"
      justify="center"
      align="center"
      borderBottomWidth={1}
      borderColor="primary.600"
      fontWeight="semibold"
    >
      <MacButtons position="absolute" left={0} pl={4} />
      <Text>Scrapbook</Text>
      <OpenSeaLogo position="absolute" right={0} pr={4} boxSize={4} />
    </Flex>
  );
};

enum SidebarOption {
  Editor = "Editor",
  Wallet = "Wallet",
}

export const Sidebar = () => {
  const [selected, setSelected] = useState<SidebarOption>(SidebarOption.Editor);

  return (
    <Flex direction="column" w={96} userSelect="none">
      <ConnectButton />
      <Flex
        w="full"
        bgColor="primary.600"
        h={10}
        align="center"
        borderTopWidth={1}
        borderColor="primary.600"
      >
        {Object.values(SidebarOption).map((item) => (
          <Flex
            key={item}
            bgColor={item == selected ? "selected" : "unselected"}
            h="full"
            w={16}
            justify="center"
            align="center"
            fontSize="xs"
            fontWeight="semibold"
            borderColor="primary.600"
            borderRightWidth={1}
            borderBottomWidth={item == selected ? 0 : 1}
            cursor="pointer"
            onClick={() => setSelected(item)}
            _hover={{ bgColor: "selected" }}
          >
            {item}
          </Flex>
        ))}
      </Flex>
      {selected === SidebarOption.Editor && <Editor />}
      {selected === SidebarOption.Wallet && <div>Wallet todo</div>}
    </Flex>
  );
};
