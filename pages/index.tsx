import { Flex } from "@chakra-ui/react";
import { Display } from "@slimesunday/components/Display";
import { Layers } from "@slimesunday/components/Layers";
import { Menu } from "@slimesunday/components/Menu";
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
      <Layers />
    </Flex>
  </Flex>
);

export default Home;
