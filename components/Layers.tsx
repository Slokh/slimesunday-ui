import {
  Box,
  Flex,
  Icon,
  Image,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { MenuButton } from "@slimesunday/components/Menu";
import { Layer, useEditor } from "@slimesunday/context/editor";
import update from "immutability-helper";
import { useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { BsPlusLg, BsX } from "react-icons/bs";
import { MdLock, MdOutlineSwapHoriz } from "react-icons/md";
import { ModalRouter } from "./Modal";

import type { Identifier, XYCoord } from "dnd-core";

const LayersHeader = ({ isActive }: { isActive: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      w="full"
      bgColor="primary.600"
      h={10}
      align="center"
      justify="space-between"
    >
      <Flex
        bgColor="primary.500"
        h="full"
        w={16}
        justify="center"
        align="center"
        fontSize="xs"
        fontWeight="semibold"
        color="primary.200"
      >
        Layers
      </Flex>
      <Flex>
        <MenuButton icon={BsPlusLg} onClick={onOpen} isDisabled={!isActive} />
        <ModalRouter isOpen={isOpen} onClose={onClose} activeModal="Layers" />
      </Flex>
    </Flex>
  );
};

const Background = ({ background }: { background: Layer }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex
      w="full"
      h={16}
      borderBottomWidth={1}
      borderBottomColor="primary.700"
      align="center"
      justify="space-between"
      p={2}
    >
      <Stack direction="row" align="center">
        <Box boxSize={8}>
          <Image src={background.image} alt={background.name} />
        </Box>
        <Text color="primary.100" fontWeight="semibold" fontSize="sm" pl={2}>
          {background.name}
        </Text>
      </Stack>
      <Stack direction="row" spacing={0}>
        <LayerButton icon={MdOutlineSwapHoriz} onClick={onOpen} />
        <LayerButton icon={MdLock} isDisabled />
        <ModalRouter
          isOpen={isOpen}
          onClose={onClose}
          activeModal="Backgrounds"
        />
      </Stack>
    </Flex>
  );
};

export const Layers = () => {
  const {
    active: { background, layers },
    setLayers,
  } = useEditor();

  const moveLayer = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      // @ts-ignore
      setLayers((prevLayers: Layer[]) =>
        update(prevLayers, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevLayers[dragIndex] as Layer],
          ],
        })
      );
    },
    [setLayers]
  );

  const renderLayer = useCallback(
    (layer: { name: string; image: string }, index: number) => {
      return (
        <DraggableLayer
          key={layer.name}
          index={index}
          id={layer.name}
          layer={layer}
          moveLayer={moveLayer}
        />
      );
    },
    [moveLayer]
  );

  return (
    <Flex direction="column" w={96} bgColor="primary.500" userSelect="none">
      <LayersHeader isActive={!!background} />
      {layers.map((layer: any, i) => renderLayer(layer, i))}
      {background && <Background background={background} />}
    </Flex>
  );
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DraggableLayer = ({ id, index, moveLayer, layer }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "layer",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveLayer(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "layer",
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      <Layer layer={layer} />
    </div>
  );
};

const Layer = ({ layer }: { layer: Layer }) => {
  const { removeLayer } = useEditor();

  return (
    <Flex
      w="full"
      h={16}
      borderBottomWidth={1}
      borderBottomColor="primary.700"
      align="center"
      justify="space-between"
      cursor="pointer"
      p={2}
    >
      <Stack direction="row" align="center">
        <Box boxSize={8}>
          <Image src={layer.image} alt={layer.name} />
        </Box>
        <Text color="primary.100" fontWeight="semibold" fontSize="sm" pl={2}>
          {layer.name}
        </Text>
      </Stack>
      <Stack direction="row" spacing={0}>
        <LayerButton icon={BsX} onClick={() => removeLayer(layer)} />
      </Stack>
    </Flex>
  );
};

const LayerButton = ({
  icon,
  boxSize,
  onClick,
  isDisabled,
}: {
  icon: any;
  boxSize?: number;
  onClick?: any;
  isDisabled?: boolean;
}) => {
  return (
    <Flex
      onClick={isDisabled ? () => {} : onClick}
      color={isDisabled ? "primary.300" : "primary.100"}
      borderRadius={8}
      w={7}
      h={7}
      transition="all 0.2s ease"
      cursor="pointer"
      align="center"
      justify="center"
      _hover={isDisabled ? {} : { bgColor: "primary.600" }}
    >
      <Icon as={icon} boxSize={boxSize || 5} />
    </Flex>
  );
};
