import { Flex } from "@chakra-ui/react";
import { Layer, LayerType, useEditor } from "@slimesunday/context/editor";
import { useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ModalType } from "./Modal";

import type { Identifier, XYCoord } from "dnd-core";
import { EditorRow, EditorRowAction } from "./EditorRow";

export const EditorLayers = () => {
  const {
    active: { layers },
    setLayers,
  } = useEditor();

  const moveLayer = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newLayers = [...layers];
      newLayers.splice(dragIndex, 1);
      newLayers.splice(hoverIndex, 0, layers[dragIndex]);
      setLayers(newLayers);
    },
    [layers, setLayers]
  );

  const renderLayer = useCallback(
    (layer: Layer, index: number) => {
      return (
        <DraggableLayer
          key={index}
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
    <Flex direction="column">
      {layers.map((layer: any, i) => renderLayer(layer, i))}
    </Flex>
  );
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DraggableLayer = ({
  id,
  index,
  moveLayer,
  layer,
}: {
  id: string;
  index: number;
  moveLayer: any;
  layer: Layer;
}) => {
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

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveLayer(dragIndex, hoverIndex);

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
      <EditorRow
        layer={layer}
        actions={
          layer.layerType === LayerType.Portrait
            ? [EditorRowAction.Swap]
            : [EditorRowAction.Toggle, EditorRowAction.Delete]
        }
        modalType={
          layer.layerType === LayerType.Portrait
            ? ModalType.Portraits
            : ModalType.Layers
        }
        isDraggable
      />
    </div>
  );
};
