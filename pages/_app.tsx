import { ChakraProvider } from "@chakra-ui/react";
import theme from "@slimesunday/theme";
import { AppProps } from "next/app";
import Head from "next/head";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "public/fonts/style.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chain.rinkeby],
  [publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: "Slimeshop",
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
          <title>SLIMESHOP</title>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </DndProvider>
    </ChakraProvider>
  );
};

export default App;
