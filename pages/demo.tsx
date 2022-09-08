import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spacer,
  Stack,
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
import { EditorProvider, useEditor } from "@slimesunday/context/editor";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const CountdownModal = () => {
  const { chainConfig } = useEditor();
  const [status, setStatus] = useState("");
  const [isOpen, setIsOpen] = useState(
    Date.now() / 1000 < chainConfig.saleStartTimestamp
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(getStatus(chainConfig.saleStartTimestamp));
      setIsOpen(Date.now() / 1000 < chainConfig.saleStartTimestamp);
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered>
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
                <Text fontSize={["xl", "4xl"]}>OPENING SEP 8TH @ 2PM EST</Text>
                <Text fontSize={["xl", "4xl"]}>{status}</Text>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const Home: NextPage = () => (
  <EditorProvider>
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
    <CountdownModal />
  </EditorProvider>
);

export default Home;
