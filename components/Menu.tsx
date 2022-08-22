import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

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

const getStatus = () => {
  let difference = +new Date("2022-09-15 19:00:00 GMT") - +new Date();

  let timeLeft = "";

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `OPENS IN ${days}:${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  return "";
};

export const Menu = () => {
  const [status, setStatus] = useState(getStatus());

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(getStatus());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <Flex
      h={8}
      w="full"
      justify="center"
      align="center"
      borderBottomWidth={1}
      borderColor="secondary"
      fontWeight="semibold"
      justifyContent="space-between"
      pl={4}
      pr={4}
    >
      <MacButtons />
      <Text fontWeight="bold">SLIMESHOP</Text>
      <Text w={48} fontWeight="bold" textAlign="end">
        {status}
      </Text>
    </Flex>
  );
};
