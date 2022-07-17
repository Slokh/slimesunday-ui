import { Box, Flex, Icon, Image, Spacer, Stack, Text } from "@chakra-ui/react";
import { useEditor } from "@slimesunday/context/editor";
import { BsCheckLg, BsQuestionLg } from "react-icons/bs";
import { MdLogin } from "react-icons/md";

export const MacButtons = (props: any) => (
  <Stack direction="row" spacing={2} {...props}>
    <Box w={3} h={3} borderRadius={64} bgColor="#ff5c5c" />
    <Box w={3} h={3} borderRadius={64} bgColor="#ffbd4c" />
    <Box w={3} h={3} borderRadius={64} bgColor="#00ca56" />
  </Stack>
);

const OpenSeaLogo = () => (
  <Flex position="absolute" right={0} pr={4}>
    <Image
      src="https://opensea.io/static/images/logos/opensea.svg"
      alt="opensea"
      w={4}
      h={4}
    />
  </Flex>
);

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

const MenuDivider = () => (
  <Flex borderRightWidth={1} borderColor="primary.700" w={1} h={4} />
);

export const Menu = () => {
  const {
    wallet: { active, connect, account, name },
  } = useEditor();

  return (
    <Flex direction="column">
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
        <Text>Slimeshop</Text>
        <OpenSeaLogo />
      </Flex>
      <Stack
        w="full"
        bgColor="primary.500"
        borderColor="primary.700"
        align="center"
        direction="row"
        borderBottomWidth={1}
        p={1}
        borderBottomColor="primary.700"
        spacing={2}
      >
        <MenuButton
          icon={MdLogin}
          text={active ? name || account : "Connect Wallet"}
          onClick={connect}
        />
        <Spacer />
        <MenuDivider />
        <MenuButton icon={BsQuestionLg} text="FAQ" />
        <MenuDivider />
        <MenuButton icon={BsCheckLg} text="Submit" isDisabled={!active} />
      </Stack>
    </Flex>
  );
};
