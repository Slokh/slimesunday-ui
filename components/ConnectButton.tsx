import { Flex, Stack, Text } from "@chakra-ui/react";
import { ConnectButton as RainbowKitConnectbutton } from "@rainbow-me/rainbowkit";
import { MdPortrait } from "react-icons/md";
import { Row, RowButton } from "./EditorRow";

export const ConnectButton = () => {
  return (
    <RainbowKitConnectbutton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Flex
                    onClick={openConnectModal}
                    cursor="pointer"
                    w="full"
                    h={16}
                    justify="center"
                    align="center"
                    fontWeight="bold"
                    fontSize="md"
                    transition="all 0.2s ease"
                    _hover={{ bgColor: "primary.300" }}
                  >
                    Connect a wallet
                  </Flex>
                );
              }
              if (chain.unsupported) {
                return (
                  <Flex
                    onClick={openChainModal}
                    cursor="pointer"
                    w="full"
                    h={16}
                    justify="center"
                    align="center"
                    fontWeight="bold"
                    fontSize="md"
                    transition="all 0.2s ease"
                    _hover={{ bgColor: "primary.300" }}
                  >
                    Switch network
                  </Flex>
                );
              }
              return (
                <Row>
                  <Text
                    color="primary.100"
                    fontWeight="semibold"
                    fontSize="sm"
                    pl={2}
                  >
                    {account.displayName}
                  </Text>
                  <Stack direction="row" spacing={0}>
                    <RowButton icon={MdPortrait} onClick={openAccountModal} />
                  </Stack>
                </Row>
              );
            })()}
          </div>
        );
      }}
    </RainbowKitConnectbutton.Custom>
  );
};
