import { Box, Flex, Image } from "@chakra-ui/react";
import { useEditor } from "@slimesunday/context/editor";

export const Display = () => {
  const {
    active: { background, portrait, layers },
  } = useEditor();

  const displayLayers = [...layers].reverse();

  return (
    <Flex flexGrow={1} justify="center" align="center" bgColor="primary.600">
      <Flex position="relative" w="xl" justify="center" align="center">
        {background && (
          <Box position="absolute">
            <Image
              src={background.image}
              alt={background.name}
              h="100%"
              w="100%"
              objectFit="contain"
            />
          </Box>
        )}
        {portrait && (
          <Box position="absolute">
            <Image
              src={portrait.image}
              alt={portrait.name}
              h="100%"
              w="100%"
              objectFit="contain"
            />
          </Box>
        )}
        {displayLayers.map((layer: any, i) => (
          <Box key={i} position="absolute">
            <Image
              src={layer.image}
              alt={layer.name}
              h="100%"
              w="100%"
              objectFit="contain"
            />
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};
