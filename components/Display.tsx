import { Box, Flex, Image } from "@chakra-ui/react";
import { BoundLayer, useEditor } from "@slimesunday/context/editor";

export const Display = ({
  boundLayer,
  height,
  width,
}: {
  boundLayer?: BoundLayer;
  height?: string;
  width?: string;
}) => {
  const { active } = useEditor();
  const { background, portrait, layers } = boundLayer || active;
  const displayLayers = [...layers]
    .reverse()
    .filter(({ isHidden }) => !isHidden);

  return (
    <Flex
      flexGrow={width || height ? 0 : 1}
      justify="center"
      align="center"
      bgColor={width || height ? "" : "secondary"}
    >
      <Flex
        position="relative"
        w={width || "500px"}
        h={height || "625px"}
        justify="center"
        align="center"
        bgColor="tertiary"
      >
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
      </Flex>
    </Flex>
  );
};
