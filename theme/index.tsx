import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      0: "#FFFFFF",
      100: "#CAF768",
      200: "#6FDA82",
      300: "#00B894",
      400: "#009294",
      500: "#0F6C7E",
      600: "#2F4858",
      700: "#000000",
    },
    selected: "#CAF768",
    unselected: "#6FDA82",
    hover: "#6FDA82",
    disabled: "#00B894",
    darkHover: "#00B894",
  },
  fonts: {
    body: "Bungee",
  },
  components: {
    Text: {
      baseStyle: {
        color: "primary.700",
        fontWeight: "medium",
        fontSize: "sm",
      },
    },
    Flex: {
      variants: {
        disabled: {
          color: "primary.300",
          bgColor: "primary.200",
          cursor: "default",
        },
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
