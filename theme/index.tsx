import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      0: "#FFFFFF",
      100: "#DDDDDD",
      200: "#B0B0B0",
      300: "#696969",
      400: "#535353",
      500: "#4D4D4D",
      600: "#383838",
      700: "#282828",
      900: "#000000",
    },
  },
  fonts: {
    body: "Inter",
  },
});

export default theme;
