import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ConnectButton } from "./ConnectButton";
import { Editor } from "./Editor";

export const MacButtons = (props: any) => (
  <Stack direction="row" spacing={2} {...props}>
    <Box w={3} h={3} borderRadius={64} bgColor="#FF3B5E" />
    <Box w={3} h={3} borderRadius={64} bgColor="#3C3FFF" />
    <Box w={3} h={3} borderRadius={64} bgColor="#9F3BFF" />
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
      h={8}
      w="full"
      justify="center"
      align="center"
      borderBottomWidth={1}
      borderColor="secondary"
      fontWeight="semibold"
    >
      <MacButtons position="absolute" left={0} pl={4} />
      <Text fontWeight="bold">SCRAPBOOK</Text>
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
    <Flex direction="column" h="full" w={96} userSelect="none">
      <ConnectButton />
      <Flex
        w="full"
        bgColor="secondary"
        h={10}
        align="center"
        borderTopWidth={1}
        borderColor="secondary"
      >
        {Object.values(SidebarOption).map((item) => (
          <Flex
            key={item}
            bgColor={item == selected ? "primary" : "secondary"}
            color={item == selected ? "secondary" : "tertiary"}
            h="full"
            w={16}
            justify="center"
            align="center"
            fontSize="xs"
            fontWeight="semibold"
            borderColor="secondary"
            borderRightWidth={1}
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
