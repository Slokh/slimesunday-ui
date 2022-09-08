import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Flex,
  Stack,
  Spacer,
  Text,
} from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@slimesunday/components/ConnectButton";
import { Display } from "@slimesunday/components/Display";
import { Editor } from "@slimesunday/components/Editor";
import {
  getStatus,
  MacButtons,
  Menu,
  OpenSeaLogo,
} from "@slimesunday/components/Menu";
import { CHAIN_CONFIG } from "@slimesunday/utils";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => (
  <Flex minH="100vh" w="full" bgColor="primary" direction="column">
    <Menu />
    <Flex flexGrow={1}>
      <Display />
      <Flex direction="column" h="full" w={96} userSelect="none">
        <ConnectButton />
        <Editor />
      </Flex>
    </Flex>
  </Flex>
);

const TempHome: NextPage = () => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(getStatus(CHAIN_CONFIG[1].saleStartTimestamp));
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <Flex>
      <Flex minH="100vh" w="full" bgColor="primary" direction="column">
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
        </Flex>
        <Flex w="full" h="98vh">
          <Flex h="full" w="8xl" bgColor="secondary" userSelect="none"></Flex>
          <Flex direction="column" h="full" w={96} userSelect="none"></Flex>
        </Flex>
      </Flex>
      <Modal isOpen={true} onClose={() => {}} isCentered>
        <ModalOverlay />
        <ModalContent bgColor="transparent" maxW="3xl">
          <ModalBody p={0} m={0}>
            <Flex cursor="default" userSelect="none">
              <Flex w="full" direction="column">
                <Stack
                  direction="row"
                  bgColor="primary"
                  w="full"
                  align="center"
                  borderTopRightRadius={8}
                  borderTopLeftRadius={8}
                  borderBottomColor="secondary"
                  borderBottomWidth={1}
                  p={4}
                >
                  <MacButtons />
                  <Spacer />
                  <OpenSeaLogo boxSize={6} />
                </Stack>
                <Flex
                  direction="column"
                  bgColor="primary"
                  w="full"
                  pt={16}
                  pb={16}
                  pl={4}
                  pr={4}
                  justify="center"
                  align="center"
                  textAlign="center"
                  borderBottomRightRadius={8}
                  borderBottomLeftRadius={8}
                >
                  <Text fontSize={["xl", "4xl"]}>Welcome to the</Text>
                  <Text fontSize={["4xl", "7xl"]}>SLIMESHOP</Text>
                  <Text fontSize={["xl", "4xl"]}>
                    OPENING SEP 8TH @ 2PM EST
                  </Text>
                  <Text fontSize={["xl", "4xl"]}>{status}</Text>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default TempHome;
