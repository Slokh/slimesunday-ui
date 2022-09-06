import { Flex } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@slimesunday/components/ConnectButton";
import { Display } from "@slimesunday/components/Display";
import { Editor } from "@slimesunday/components/Editor";
import { Menu } from "@slimesunday/components/Menu";
import { EditorProvider } from "@slimesunday/context/editor";
import { CONTRACT_ADDRESS } from "@slimesunday/utils";
import type { NextPage } from "next";

const Home: NextPage = () => (
  <EditorProvider contractAddress={CONTRACT_ADDRESS}>
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
  </EditorProvider>
);

export default Home;
