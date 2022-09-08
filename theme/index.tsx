import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    white: "#FFFFFF",
    primary: "#6DF709",
    primarydark: "#3BC500",
    secondary: "#1D1D1D",
    tertiary: "#C6C6C4",
    black: "#000000",
  },
  fonts: {
    body: "Retro Gaming",
  },
  components: {
    Text: {
      baseStyle: {
        color: "secondary",
        fontWeight: "medium",
        fontSize: "sm",
      },
    },
  },
  styles: {
    global: {
      "*": {
        transition: "all 0.2s ease",
      },
    },
  },
});

export default theme;
