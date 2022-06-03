import { ChakraProvider } from "@chakra-ui/react";
import { EditorProvider } from "@slimesunday/context/editor";
import { AppProps } from "next/app";
import theme from "@slimesunday/theme";
import Head from "next/head";
import "@fontsource/inter/100.css";
import "@fontsource/inter/200.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>SlimeSunday</title>
      </Head>
      <EditorProvider>
        <Component {...pageProps} />
      </EditorProvider>
    </ChakraProvider>
  );
};

export default App;
