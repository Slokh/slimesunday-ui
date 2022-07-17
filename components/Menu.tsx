import { Box, Flex, Icon, Image, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ConnectButton } from "./ConnectButton";
import { Editor } from "./Editor";

export const MacButtons = (props: any) => (
  <Stack direction="row" spacing={2} {...props}>
    <Box w={3} h={3} borderRadius={64} bgColor="#ff5c5c" />
    <Box w={3} h={3} borderRadius={64} bgColor="#ffbd4c" />
    <Box w={3} h={3} borderRadius={64} bgColor="#00ca56" />
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

export const MenuButton = ({
  icon,
  text,
  boxSize,
  onClick,
  isDisabled,
}: any) => (
  <Stack
    cursor={isDisabled ? "default" : "pointer"}
    align="center"
    direction="row"
    spacing={1}
    onClick={isDisabled ? () => {} : onClick}
    color={isDisabled ? "primary.300" : "primary.100"}
    borderRadius={8}
    p={0.5}
    pl={2}
    pr={2}
    transition="all 0.2s ease"
    _hover={isDisabled ? {} : { bgColor: "primary.600" }}
  >
    <Icon as={icon} boxSize={boxSize || 3} />
    <Text fontSize="xs" fontWeight="semibold">
      {text}
    </Text>
  </Stack>
);

export const Menu = () => {
  return (
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
    <Flex direction="column" w={96} bgColor="primary.500" userSelect="none">
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
            bgColor={item == selected ? "primary.500" : "primary.600"}
            h="full"
            w={16}
            justify="center"
            align="center"
            fontSize="xs"
            fontWeight="semibold"
            color="primary.200"
            borderColor="primary.700"
            borderRightWidth={1}
            cursor="pointer"
            onClick={() => setSelected(item)}
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
