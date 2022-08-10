import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";

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
      <Text fontWeight="bold">SLIMESHOP</Text>
      <OpenSeaLogo position="absolute" right={0} pr={4} boxSize={4} />
    </Flex>
  );
};
