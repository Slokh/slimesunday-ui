import { Flex, Link, Stack, Text } from "@chakra-ui/react";
import { ConnectButton as RainbowKitConnectbutton } from "@rainbow-me/rainbowkit";
import { BsPersonFill } from "react-icons/bs";
import { useNetwork } from "wagmi";
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
                    color="secondary"
                    align="center"
                    fontWeight="bold"
                    fontSize="md"
                    transition="all 0.2s ease"
                    _hover={{ bgColor: "primarydark" }}
                  >
                    CONNECT A WALLET
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
                    _hover={{ bgColor: "primarydark" }}
                  >
                    Switch network
                  </Flex>
                );
              }
              return (
                <Row>
                  <Text fontWeight="semibold" fontSize="sm" pl={2}>
                    <Link
                      isExternal
                      href={`https://${
                        chain.id === 4 ? "testnets." : ""
                      }opensea.io/${account.address}`}
                    >
                      {account.displayName.toUpperCase()}
                    </Link>
                  </Text>
                  <Stack direction="row" spacing={0} pr={2}>
                    <RowButton icon={BsPersonFill} onClick={openAccountModal} />
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
