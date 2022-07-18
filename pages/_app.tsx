import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/bungee";
import { EditorProvider } from "@slimesunday/context/editor";
import theme from "@slimesunday/theme";
import { AppProps } from "next/app";
import Head from "next/head";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.rinkeby],
  [publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: "Scrapbook",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <Head>
          <title>SlimeSunday</title>
        </Head>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <EditorProvider>
              <Component {...pageProps} />
            </EditorProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </DndProvider>
    </ChakraProvider>
  );
};

export default App;
