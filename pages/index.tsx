import { Flex } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";
import { Display } from "@slimesunday/components/Display";
import { Menu, Sidebar } from "@slimesunday/components/Menu";
import type { NextPage } from "next";

const Home: NextPage = () => (
  <Flex
    minH="100vh"
    w="full"
    bgColor="primary.700"
    color="primary.100"
    fontWeight="medium"
    fontSize="sm"
    direction="column"
  >
    <Menu />
    <Flex flexGrow={1}>
      <Display />
      <Sidebar />
    </Flex>
  </Flex>
);

export default Home;
