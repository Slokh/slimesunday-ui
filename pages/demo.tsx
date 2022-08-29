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

export default Home;
