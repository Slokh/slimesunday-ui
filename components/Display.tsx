import { Box, Flex, Image } from "@chakra-ui/react";
import { useEditor } from "@slimesunday/context/editor";

export const Display = () => {
  const {
    active: { background, portrait, layers },
  } = useEditor();

  const displayLayers = [...layers].reverse();

  return (
    <Flex flexGrow={1} justify="center" align="center" bgColor="primary.600">
      <Box position="relative" w="500px" h="625px" bgColor="primary.100">
        {background && (
          <Box position="absolute">
            <Image src={background.image} alt={background.name} />
          </Box>
        )}
        {portrait && (
          <Box position="absolute">
            <Image src={portrait.image} alt={portrait.name} />
          </Box>
        )}
        {displayLayers.map((layer: any, i) => (
          <Box key={i} position="absolute">
            <Image src={layer.image} alt={layer.name} />
          </Box>
        ))}
      </Box>
    </Flex>
  );
};
